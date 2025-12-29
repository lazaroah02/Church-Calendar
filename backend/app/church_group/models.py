from django.db import models
from django.db import transaction
from django.db.models.signals import (
    post_save,
    post_migrate,
    pre_save, 
    post_delete,
    m2m_changed
    )
from django.contrib.auth import get_user_model
from django.dispatch import receiver
import os

GROUPS_IMAGES_FILDER = 'church_groups_images'
GENERAL_GROUP_NAME = "Todos"
GENERAL_GROUP_DESCRIPTION = "Grupo general para todos los usuarios"


# The following ChurchGroupQuerySet and ChurchGroupManager ensures that 
# the general group cannot be deleted or bulk updated.
class ChurchGroupQuerySet(models.QuerySet):
    def delete(self, *args, **kwargs):
        # evoid deleting the general Cgroup
        qs = self.exclude(name=GENERAL_GROUP_NAME)
        return super(ChurchGroupQuerySet, qs).delete(*args, **kwargs)


class ChurchGroupManager(models.Manager):
    def get_queryset(self):
        return ChurchGroupQuerySet(self.model, using=self._db)

    def bulk_update(self, objs, fields, **kwargs):
        safe_objs = [obj for obj in objs if obj.name != GENERAL_GROUP_NAME]
        return super().bulk_update(safe_objs, fields, **kwargs)


class ChurchGroup(models.Model):
    name = models.CharField(max_length=100, unique=True)
    description = models.TextField(blank=True)
    img = models.ImageField(
        upload_to=GROUPS_IMAGES_FILDER,
        blank=True, null=True
        )
    color = models.CharField(max_length=100, blank=True)

    objects = ChurchGroupManager()

    def __str__(self):
        return self.name

    def delete(self, *args, **kwargs):
        if self.name == GENERAL_GROUP_NAME:
            # Prevent deletion of the general group
            return
        super().delete(*args, **kwargs)


@receiver(post_migrate)
def ensure_general_group_exists(sender, **kwargs):
    '''This signal ensures that the general group exists.'''
    ChurchGroup.objects.get_or_create(name=GENERAL_GROUP_NAME, defaults={
        'description': GENERAL_GROUP_DESCRIPTION,
        'color': '#eca100'
        })


@receiver(post_save, sender=get_user_model()) 
def ensure_user_in_general_group(sender, instance, created, **kwargs): 
    '''This signal ensures that all users are in group general.''' 
    try:
        def _add(): 
            general, _ = ChurchGroup.objects.get_or_create(
                name=GENERAL_GROUP_NAME, 
                defaults={'description': GENERAL_GROUP_DESCRIPTION} 
                ) 
            instance.member_groups.add(general) 
        transaction.on_commit(_add)        
    except Exception as e:
        print("Error on church_groups signals at ensure_user_in_general_group: ", e)


@receiver(m2m_changed, sender=get_user_model().member_groups.through)
def ensure_user_in_general_group_after_m2m_changes(
    sender, instance, action, reverse, **kwargs
):
    """
    Ensures that the user is always in the general group.
    Runs whenever the member_groups relation changes.
    """
    if action not in ("post_add", "post_remove", "post_clear"):
        return

    # 🚨 If reverse=True, instance is ChurchGroup → ignore
    if reverse:
        return

    # ✅ Here instance IS CustomUser
    try:
        general, _ = ChurchGroup.objects.get_or_create(
            name=GENERAL_GROUP_NAME,
            defaults={"description": GENERAL_GROUP_DESCRIPTION}
        )

        if not instance.member_groups.filter(pk=general.pk).exists():
            instance.member_groups.add(general)

    except Exception as e:
        print(
            "Error on church_groups signals at: "
            "ensure_user_in_general_group_after_m2m_changes",
            e
        )


@receiver(pre_save, sender=ChurchGroup)
def ensure_general_group_is_not_modified(sender, instance, **kwargs):
    '''This signal ensures that the general group cannot be modified.'''
    if instance.pk:
        original = ChurchGroup.objects.get(pk=instance.pk)
        if original.name == GENERAL_GROUP_NAME:
            # Prevent modification of the general group
            instance.name = GENERAL_GROUP_NAME
            instance.description = GENERAL_GROUP_DESCRIPTION


@receiver(post_delete, sender=ChurchGroup)
def delete_group_image(sender, instance, **kwargs):
    """
    Delete related image from the filesystem when a group is deleted.
    """
    try:
        img = getattr(instance, "img")
        if img is not None:
            img_path = img.path
            if os.path.exists(img_path):
                os.remove(img_path)
    except Exception:
        pass

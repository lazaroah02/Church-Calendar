import factory
from django.contrib.auth import get_user_model

User = get_user_model()


class UserFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = User

    email = factory.Sequence(lambda n: f"user{n}@example.com")
    username = factory.Sequence(lambda n: f"user{n}")
    full_name = factory.Faker("name")
    description = factory.Faker("sentence", nb_words=8)
    phone_number = factory.Faker("phone_number")
    fcm_token = None
    profile_img = None

    is_active = True
    is_staff = False
    is_superuser = False

    password = factory.PostGenerationMethodCall("set_password", "password123")

    @factory.post_generation
    def member_groups(self, create, extracted, **kwargs):
        """
        This method allows adding member groups to the user after creation.:
        - UserFactory(member_groups=[g1, g2])
        - By default it doesn't add any.
        """
        if not create:
            return
        if extracted:
            for group in extracted:
                self.member_groups.add(group)

from django.urls import reverse
from django.core.files.uploadedfile import SimpleUploadedFile
from django.conf import settings
from rest_framework.test import APIClient

from church_group.models import ChurchGroup
from event.tests.factories import EventFactory
from church_group.tests.factories import ChurchGroupFactory
from user.tests.factories import UserFactory
from event.views import GENERAL_GROUP_NAME
from event.tests.base import MediaRootCleanUpTestCase, TEST_IMAGES_FOLDER


class TestEventsViewSet(MediaRootCleanUpTestCase):
    @classmethod
    def setUpTestData(cls):
        cls.general_group, _ = ChurchGroup.objects.get_or_create(name=GENERAL_GROUP_NAME)
        cls.url = reverse("events-list")

    def setUp(self):
        self.client = APIClient()

    def test_anonymous_user_sees_only_general_group_events(self):
        event_general = EventFactory(groups=[self.general_group], visible=True)
        EventFactory(visible=True) 

        response = self.client.get(self.url)

        self.assertEqual(response.status_code, 200)
        ids = [e["id"] for e in response.json()]
        self.assertEqual(ids, [event_general.id])

    def test_authenticated_user_sees_events_from_their_groups(self):
        user = UserFactory()
        group = ChurchGroupFactory()
        user.member_groups.add(group)

        event_in_group = EventFactory(groups=[group], visible=True)
        EventFactory(groups=[self.general_group], visible=True)

        self.client.force_authenticate(user=user)
        response = self.client.get(self.url)

        self.assertEqual(response.status_code, 200)
        ids = [e["id"] for e in response.json()]
        self.assertEqual(ids, [event_in_group.id])

    def test_non_visible_events_are_not_returned(self):
        user = UserFactory()
        group = ChurchGroupFactory()
        user.member_groups.add(group)

        EventFactory(groups=[group], visible=False)

        self.client.force_authenticate(user=user)
        response = self.client.get(self.url)

        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json(), [])

    def test_distinct_removes_duplicate_events(self):
        user = UserFactory()
        g1 = ChurchGroupFactory()
        g2 = ChurchGroupFactory()
        user.member_groups.add(g1, g2)

        event = EventFactory(groups=[g1, g2], visible=True)

        self.client.force_authenticate(user=user)
        response = self.client.get(self.url)

        self.assertEqual(response.status_code, 200)
        ids = [e["id"] for e in response.json()]
        self.assertEqual(ids.count(event.id), 1)

    def test_event_with_image_is_saved_in_test_media_root(self):
        image_content = b"fake image content"
        image = SimpleUploadedFile("test.jpg", image_content, content_type="image/jpeg")

        event = EventFactory(img=image, groups=[self.general_group], visible=True)

        self.assertTrue(event.img)
        self.assertTrue(event.img.path.startswith(str(settings.MEDIA_ROOT)))
        self.assertIn(TEST_IMAGES_FOLDER, event.img.path)

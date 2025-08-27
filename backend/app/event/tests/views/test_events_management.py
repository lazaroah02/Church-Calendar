import datetime
from django.urls import reverse
from rest_framework.test import APIClient
from rest_framework import status
from django.utils.timezone import now

from user.tests.factories import UserFactory
from event.tests.factories import EventFactory
from church_group.models import ChurchGroup
from event.models import Event
from event.tests.base import MediaRootCleanUpTestCase


class TestManageEventsAuth(MediaRootCleanUpTestCase):
    @classmethod
    def setUpTestData(cls):
        cls.url_list = reverse("manage-events-list")
        cls.group = ChurchGroup.objects.create(name="Test Group")

    def setUp(self):
        self.client = APIClient()

    def test_anonymous_user_cannot_access(self):
        response = self.client.get(self.url_list)
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_non_admin_user_cannot_access(self):
        user = UserFactory(is_staff=False, is_superuser=False)
        self.client.force_authenticate(user=user)
        response = self.client.get(self.url_list)
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_admin_user_can_list_events(self):
        admin = UserFactory(is_staff=True, is_superuser=True)
        EventFactory.create_batch(3, groups=[self.group])
        self.client.force_authenticate(user=admin)

        response = self.client.get(self.url_list)

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.json()), 3)


class TestManageEventsCRUD(MediaRootCleanUpTestCase):
    @classmethod
    def setUpTestData(cls):
        cls.url_list = reverse("manage-events-list")
        cls.url_detail = "manage-events-detail"
        cls.group = ChurchGroup.objects.create(name="Test Group")

    def setUp(self):
        self.client = APIClient()
        self.admin = UserFactory(is_staff=True, is_superuser=True)
        self.client.force_authenticate(user=self.admin)

    def test_admin_can_retrieve_single_event(self):
        event = EventFactory(groups=[self.group])
        url = reverse(self.url_detail, args=[event.id])
        response = self.client.get(url)

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.json()["id"], event.id)

    def test_admin_can_create_event(self):
        payload = {
            "title": "New Event",
            "description": "This is a new test event",
            "groups": [self.group.id],
            "visible": True,
            "start_time": now(),
            "end_time": now() + datetime.timedelta(hours=2),
            "location": "Test Location",
        }
        response = self.client.post(self.url_list, payload, format="json")

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertTrue(Event.objects.filter(title="New Event").exists())

    def test_admin_can_update_event(self):
        event = EventFactory(groups=[self.group])
        url = reverse(self.url_detail, args=[event.id])
        payload = {"title": "Updated Title"}
        response = self.client.patch(url, payload, format="json")

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        event.refresh_from_db()
        self.assertEqual(event.title, "Updated Title")

    def test_admin_can_delete_event(self):
        event = EventFactory(groups=[self.group])
        url = reverse(self.url_detail, args=[event.id])
        response = self.client.delete(url)

        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertFalse(Event.objects.filter(id=event.id).exists())

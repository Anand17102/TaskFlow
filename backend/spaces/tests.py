from django.contrib.auth import get_user_model
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase

from .models import Space


User = get_user_model()


class SpaceAPITests(APITestCase):
    def setUp(self):
        self.owner = User.objects.create_user(
            username="owner",
            email="owner@example.com",
            password="test-password",
        )
        self.other_user = User.objects.create_user(
            username="other",
            email="other@example.com",
            password="test-password",
        )
        self.list_url = reverse("space-list-create")
        self.client.force_authenticate(user=self.owner)

    def test_space_list_only_returns_spaces_owned_by_request_user(self):
        own_space = Space.objects.create(name="Mine", owner=self.owner)
        Space.objects.create(name="Theirs", owner=self.other_user)

        response = self.client.get(self.list_url)

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual([space["id"] for space in response.data], [own_space.id])

    def test_create_assigns_request_user_as_owner(self):
        response = self.client.post(
            self.list_url,
            {"name": "New space", "description": "A test space"},
            format="json",
        )

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        space = Space.objects.get(id=response.data["id"])
        self.assertEqual(space.owner, self.owner)
        self.assertEqual(space.name, "New space")

    def test_owner_can_retrieve_update_and_delete_space(self):
        space = Space.objects.create(name="My space", owner=self.owner)
        detail_url = reverse("space-detail", args=[space.id])

        retrieve_response = self.client.get(detail_url)
        update_response = self.client.patch(
            detail_url, {"description": "Updated"}, format="json"
        )
        delete_response = self.client.delete(detail_url)

        self.assertEqual(retrieve_response.status_code, status.HTTP_200_OK)
        self.assertEqual(update_response.status_code, status.HTTP_200_OK)
        self.assertEqual(update_response.data["description"], "Updated")
        self.assertEqual(delete_response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertFalse(Space.objects.filter(id=space.id).exists())

    def test_user_cannot_access_another_users_space(self):
        space = Space.objects.create(name="Private", owner=self.other_user)
        detail_url = reverse("space-detail", args=[space.id])

        response = self.client.get(detail_url)

        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    def test_anonymous_user_cannot_list_or_create_spaces(self):
        self.client.force_authenticate(user=None)

        list_response = self.client.get(self.list_url)
        create_response = self.client.post(
            self.list_url, {"name": "Unauthenticated"}, format="json"
        )

        self.assertEqual(list_response.status_code, status.HTTP_401_UNAUTHORIZED)
        self.assertEqual(create_response.status_code, status.HTTP_401_UNAUTHORIZED)

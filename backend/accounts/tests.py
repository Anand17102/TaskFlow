from django.contrib.auth import get_user_model
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase


User = get_user_model()


class AccountAPITests(APITestCase):
    def setUp(self):
        self.user = User.objects.create_user(
            username="account-user",
            email="account@example.com",
            password="test-password-123",
            first_name="Test",
            last_name="User",
        )
        self.register_url = reverse("register")
        self.profile_url = reverse("profile")

    def test_registration_creates_user_with_hashed_password(self):
        response = self.client.post(
            self.register_url,
            {
                "username": "new-user",
                "email": "new@example.com",
                "password": "strong-password-123",
            },
            format="json",
        )

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        user = User.objects.get(email="new@example.com")
        self.assertEqual(user.username, "new-user")
        self.assertTrue(user.check_password("strong-password-123"))
        self.assertNotIn("password", response.data)

    def test_registration_rejects_short_password(self):
        response = self.client.post(
            self.register_url,
            {
                "username": "short-password",
                "email": "short@example.com",
                "password": "short",
            },
            format="json",
        )

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertFalse(User.objects.filter(email="short@example.com").exists())

    def test_registration_rejects_duplicate_email(self):
        response = self.client.post(
            self.register_url,
            {
                "username": "duplicate-email",
                "email": self.user.email,
                "password": "strong-password-123",
            },
            format="json",
        )

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(User.objects.filter(email=self.user.email).count(), 1)

    def test_profile_returns_and_updates_authenticated_user(self):
        self.client.force_authenticate(user=self.user)

        profile_response = self.client.get(self.profile_url)
        update_response = self.client.patch(
            self.profile_url,
            {"username": "updated-user", "first_name": "Updated"},
            format="json",
        )

        self.assertEqual(profile_response.status_code, status.HTTP_200_OK)
        self.assertEqual(profile_response.data["email"], self.user.email)
        self.assertEqual(update_response.status_code, status.HTTP_200_OK)
        self.assertEqual(update_response.data["username"], "updated-user")
        self.assertEqual(update_response.data["first_name"], "Updated")
        self.assertEqual(update_response.data["email"], self.user.email)

    def test_profile_requires_authentication(self):
        response = self.client.get(self.profile_url)

        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

from django.contrib.auth import get_user_model
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase

from spaces.models import Space

from .models import Task


User = get_user_model()


class TaskAPITests(APITestCase):
    def setUp(self):
        self.owner = User.objects.create_user(
            username="task-owner",
            email="task-owner@example.com",
            password="test-password-123",
        )
        self.other_user = User.objects.create_user(
            username="task-other",
            email="task-other@example.com",
            password="test-password-123",
        )
        self.own_space = Space.objects.create(name="Own space", owner=self.owner)
        self.other_space = Space.objects.create(
            name="Other space", owner=self.other_user
        )
        self.list_url = reverse("task-list-create")
        self.client.force_authenticate(user=self.owner)

    def test_task_list_only_returns_owned_tasks_and_filters_by_space(self):
        own_task = Task.objects.create(
            title="Own task", owner=self.owner, space=self.own_space
        )
        Task.objects.create(
            title="Other space task", owner=self.owner, space=None
        )
        Task.objects.create(title="Other user task", owner=self.other_user)

        all_response = self.client.get(self.list_url)
        space_response = self.client.get(
            self.list_url, {"space": self.own_space.id}
        )

        self.assertEqual(all_response.status_code, status.HTTP_200_OK)
        self.assertCountEqual(
            [task["title"] for task in all_response.data],
            ["Own task", "Other space task"],
        )
        self.assertEqual(space_response.status_code, status.HTTP_200_OK)
        self.assertEqual(
            [task["id"] for task in space_response.data], [own_task.id]
        )

    def test_create_assigns_request_user_and_task_defaults(self):
        response = self.client.post(
            self.list_url,
            {
                "title": "New task",
                "description": "Created by the API",
                "space": self.own_space.id,
            },
            format="json",
        )

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        task = Task.objects.get(id=response.data["id"])
        self.assertEqual(task.owner, self.owner)
        self.assertEqual(task.space, self.own_space)
        self.assertEqual(task.status, Task.Status.PENDING)
        self.assertEqual(task.priority, Task.Priority.MEDIUM)

    def test_create_rejects_space_owned_by_another_user(self):
        response = self.client.post(
            self.list_url,
            {"title": "Invalid assignment", "space": self.other_space.id},
            format="json",
        )

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertFalse(Task.objects.filter(title="Invalid assignment").exists())

    def test_owner_can_retrieve_update_and_delete_task(self):
        task = Task.objects.create(title="My task", owner=self.owner)
        detail_url = reverse("task-detail", args=[task.id])

        retrieve_response = self.client.get(detail_url)
        update_response = self.client.patch(
            detail_url,
            {
                "title": "Updated task",
                "status": Task.Status.COMPLETED,
                "priority": Task.Priority.HIGH,
            },
            format="json",
        )
        delete_response = self.client.delete(detail_url)

        self.assertEqual(retrieve_response.status_code, status.HTTP_200_OK)
        self.assertEqual(update_response.status_code, status.HTTP_200_OK)
        self.assertEqual(update_response.data["title"], "Updated task")
        self.assertEqual(update_response.data["status"], Task.Status.COMPLETED)
        self.assertEqual(update_response.data["priority"], Task.Priority.HIGH)
        self.assertEqual(delete_response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertFalse(Task.objects.filter(id=task.id).exists())

    def test_user_cannot_access_another_users_task(self):
        task = Task.objects.create(title="Private task", owner=self.other_user)
        detail_url = reverse("task-detail", args=[task.id])

        response = self.client.get(detail_url)

        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    def test_task_endpoints_require_authentication(self):
        self.client.force_authenticate(user=None)

        list_response = self.client.get(self.list_url)
        create_response = self.client.post(
            self.list_url, {"title": "Anonymous task"}, format="json"
        )

        self.assertEqual(list_response.status_code, status.HTTP_401_UNAUTHORIZED)
        self.assertEqual(
            create_response.status_code, status.HTTP_401_UNAUTHORIZED
        )

package de.unibayreuth.se.taskboard;

import de.unibayreuth.se.taskboard.business.domain.Task;
import de.unibayreuth.se.taskboard.business.domain.TaskStatus;
import de.unibayreuth.se.taskboard.business.domain.User;
import de.unibayreuth.se.taskboard.business.ports.TaskService;
import de.unibayreuth.se.taskboard.business.ports.UserService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.InitializingBean;
import org.springframework.context.annotation.Profile;
import org.springframework.stereotype.Component;

import java.util.List;

/**
 * Load initial data into the list via the list service from the business layer.
 */
@Component
@RequiredArgsConstructor
@Slf4j
@Profile("dev")
class LoadInitialData implements InitializingBean {
    private final TaskService taskService;
    private final UserService userService;

    @Override
    public void afterPropertiesSet() {
        log.info("Deleting existing data...");
        userService.clear();
        taskService.clear();
        log.info("Loading initial data...");
        List<User> users = TestFixtures.createUsers(userService);
        List<Task> tasks = TestFixtures.createTasks(taskService);

        // Cycle through the users and assign them to tasks
        int userIndex = 0;
        for (Task task : tasks) {
            if (userIndex < users.size()) {
                task.setAssigneeId(users.get(userIndex).getId());
                taskService.upsert(task);
            }
            userIndex = (userIndex + 1) % (users.size() + 1);
        }

        // Cycle through the tasks and set status
        int statusIndex = 0;
        for (Task task : tasks) {
            switch (statusIndex) {
                case 0:
                    task.setStatus(TaskStatus.TODO);
                    break;
                case 1:
                    task.setStatus(TaskStatus.DOING);
                    break;
                case 2:
                    task.setStatus(TaskStatus.DONE);
                    break;
            }
            taskService.upsert(task);
            statusIndex = (statusIndex + 1) % 3;
        }
    }
}
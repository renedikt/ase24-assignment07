package de.unibayreuth.se.taskboard;

import de.unibayreuth.se.taskboard.business.domain.Task;
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

        for (Task task : tasks) {
            if (Math.random() < 0.2) {
                continue;
            }
            task.setAssigneeId(users.get((int) (Math.random() * users.size())).getId());
            taskService.upsert(task);
        }
    }
}
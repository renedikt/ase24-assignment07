import { Component } from '@angular/core';
import {TaskDto} from '../../../client/model/taskDto';
import {TasksService} from '../../../services/tasks.service';
import {CdkDropList, CdkDrag, CdkDropListGroup, CdkDragDrop, transferArrayItem} from '@angular/cdk/drag-drop';

@Component({
  selector: 'taskboard-taskboard-lists',
  imports: [
    CdkDropList,
    CdkDrag,
    CdkDropListGroup
  ],
  templateUrl: './taskboard-lists.component.html',
  styleUrl: './taskboard-lists.component.css'
})
export class TaskboardListsComponent {
  tasks: TaskDto[] = [];

  tasksToDo: TaskDto[] = [];
  tasksDoing: TaskDto[] = [];
  tasksDone: TaskDto[] = [];

  protected readonly TaskDto = TaskDto;

  constructor(private tasksService: TasksService) {
    this.tasksService = tasksService;
  }

  ngOnInit() {
    this.tasksService.getTasks().then(tasks => {
      this.tasks = tasks;
      this.tasksToDo = this.tasks.filter(task => task.status === 'TODO');
      this.tasksDoing = this.tasks.filter(task => task.status === 'DOING');
      this.tasksDone = this.tasks.filter(task => task.status === 'DONE');
    });

    this.sortTasks();
  }

  drop(event: CdkDragDrop<TaskDto[]>) {
    if (event.previousContainer === event.container) {
      return;
    }

    // Move task item to other list
    transferArrayItem(event.previousContainer.data, event.container.data, event.previousIndex, event.currentIndex);

    // Set new status
    const task = event.item.data;
    task.status = event.container.id;

    try {
      this.tasksService.updateTask(task)
    } catch (e) {
      // Undo move if update fails
      transferArrayItem(event.container.data, event.previousContainer.data, event.currentIndex, event.previousIndex);
    }

    this.sortTasks();
  }

  public filterResults(searchString: string) {
    this.tasksToDo = this.tasks.filter(task => task.status === TaskDto.StatusEnum.TODO
      && (task.title.includes(searchString) || task.description.includes(searchString) || task.assignee?.name.includes(searchString)));
    this.tasksDoing = this.tasks.filter(task => task.status === TaskDto.StatusEnum.DOING
      && (task.title.includes(searchString) || task.description.includes(searchString) || task.assignee?.name.includes(searchString)));
    this.tasksDone = this.tasks.filter(task => task.status === TaskDto.StatusEnum.DONE
      && (task.title.includes(searchString) || task.description.includes(searchString) || task.assignee?.name.includes(searchString)));

    this.sortTasks();
  }

  private sortTasks() {
    this.tasksToDo.sort((a, b) => (a.title+a.description).localeCompare(b.title+b.description));
    this.tasksDoing.sort((a, b) => (a.title+a.description).localeCompare(b.title+b.description));
    this.tasksDone.sort((a, b) => (a.title+a.description).localeCompare(b.title+b.description));
  }

  protected readonly Object = Object;
}

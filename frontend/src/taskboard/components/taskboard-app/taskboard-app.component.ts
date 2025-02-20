import { Component, ViewChild } from '@angular/core';
import {TaskboardListsComponent} from './taskboard-lists/taskboard-lists.component';

@Component({
  selector: 'taskboard-taskboard-app',
  imports: [TaskboardListsComponent],
  templateUrl: './taskboard-app.component.html',
  styleUrl: './taskboard-app.component.css'
})
export class TaskboardAppComponent {
  @ViewChild(TaskboardListsComponent) taskboardListsComponent!: TaskboardListsComponent;
}

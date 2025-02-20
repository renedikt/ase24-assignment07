import {Component} from '@angular/core';
import {TaskboardAppComponent} from './components/taskboard-app/taskboard-app.component';

@Component({
  selector: 'taskboard-root',
  imports: [
    TaskboardAppComponent
  ],
  templateUrl: './taskboard.component.html',
  styleUrl: './taskboard.component.css'
})
export class TaskboardComponent {
  title = 'TaskBoard Frontend';
}

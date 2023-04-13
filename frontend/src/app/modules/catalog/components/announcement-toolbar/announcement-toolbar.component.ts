import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { faPen } from '@fortawesome/free-solid-svg-icons';
import { faXmarkCircle } from '@fortawesome/free-regular-svg-icons';

@Component({
  selector: 'app-announcement-toolbar',
  templateUrl: './announcement-toolbar.component.html',
  styleUrls: ['./announcement-toolbar.component.scss']
})
export class AnnouncementToolbarComponent implements OnInit {
  @Input() disabled!: boolean;
  @Output() onEdit: EventEmitter<void> = new EventEmitter<void>();
  @Output() onClose: EventEmitter<void> = new EventEmitter<void>();
  editIcon = faPen;
  closeIcon = faXmarkCircle as any;
  constructor(
  ) { }

  ngOnInit(): void {
  }

  edit(): void {
    this.onEdit.emit();
  }

  close(): void {
    this.onClose.emit();
  }

}

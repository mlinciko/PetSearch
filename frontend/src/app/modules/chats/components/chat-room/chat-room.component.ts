import { AfterViewChecked, AfterViewInit, Component, ElementRef, OnDestroy, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { faArrowLeft, faPaperPlane, faPaw, faUserCircle } from '@fortawesome/free-solid-svg-icons';
import { Subject, takeUntil } from 'rxjs';
import { ImageService } from 'src/app/services/image.service';
import { SocketService } from 'src/app/services/socket.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-chat-room',
  templateUrl: './chat-room.component.html',
  styleUrls: ['./chat-room.component.scss'],
  providers: [SocketService]
})
export class ChatRoomComponent implements OnDestroy, AfterViewChecked {
  @ViewChild('scrollMe') scroll!: ElementRef;
  roomId!: number | null;
  userId!: number | null;

  chat: any
  messages: any = [];
  newMessage: string = '';

  backIcon = faArrowLeft;
  pawIcon = faPaw;
  noImageIcon = faUserCircle;
  sendIcon = faPaperPlane;

  private destroy$ = new Subject();
  firstTimeScroll: boolean = true;

  constructor(
    private socketService: SocketService,
    private route: ActivatedRoute,
    protected userService: UserService,
    private imageService: ImageService,
  ) { 
    const id = this.route.snapshot.paramMap?.get("id")
    this.roomId = id ? +id : null;

    this.userId = this.userService.getUserId();

    this.connect();
  }

  ngAfterViewChecked(): void {
    if (this.messages.length && this.firstTimeScroll) {
      this.firstTimeScroll = false;
      this.scrollToBottom();
    }
  }

  scrollToBottom(): void {
    this.scroll.nativeElement.scroll({
      top: this.scroll.nativeElement.scrollHeight,
      left: 0,
      behavior: 'smooth'
    });
  }

  connect(): void {
    this.socketService.connection();
    this.socketService.connected()
    .pipe(takeUntil(this.destroy$))
    .subscribe(
      (id: string) => {
        console.log(id);
        this.joinRoom();
        this.joinedRoom();
        this.getMessages();
      }
    )
  }

  joinRoom(): void {
    if (this.userId && this.roomId) {
      this.socketService.joinRoom(this.userId, this.roomId)
    }
  }

  joinedRoom(): void {
    this.socketService.joinedRoom()
    .pipe(takeUntil(this.destroy$))
    .subscribe(
      ({companion, announcement, messages}: any) => {
        this.chat = {
          announcement,
          companion
        }
        this.messages = messages;
        console.log(this.chat, this.messages)
      }
    )
  }

  sendMessage(message: string): void {
    if (this.userId && this.roomId) {
      this.socketService.sendMessage(message, this.userId, this.roomId)
      this.newMessage = "";
    }
  }

  getMessages(): void {
    this.socketService.getMessages()
    .pipe(takeUntil(this.destroy$))
    .subscribe(
      (res: any) => {
        this.messages = res;
        setTimeout(()=> this.scrollToBottom(),1)
      }
    )
  }

  getImage(imagePath: string, type: "announcements" | "users"): string {
    return this.imageService.getFullImagePath(imagePath, type);
  }

  ngOnDestroy(): void {
    this.socketService.disconnection();
    this.destroy$.next(null);
    this.destroy$.complete();
  }

}

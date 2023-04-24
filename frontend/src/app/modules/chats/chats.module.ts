import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChatRootComponent } from './components/chat-root/chat-root.component';
import { ChatsRoutingModule } from './chats-routing.module';
import { ChatService } from './services/chat.service';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { ChatRoomComponent } from './components/chat-room/chat-room.component';
import { DevExtremeModule } from '../dev-extreme/dev-extreme.module';

@NgModule({
  declarations: [
    ChatRootComponent,
    ChatRoomComponent,
  ],
  imports: [
    CommonModule,
    ChatsRoutingModule,
    FontAwesomeModule,
    DevExtremeModule,
  ],
  providers: [
    ChatService,
  ]
})
export class ChatsModule { }

import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, throwError } from 'rxjs';
import { environment } from 'src/environments/environment';
import { IChat } from '../models/chat.interface';
import notify from 'devextreme/ui/notify';
import { ICreateChatPayload } from '../models/create-chat-payload.iterface';

@Injectable()
export class ChatService {
  restUrl = `${environment.backUrl}/api/chat/`

  constructor(
    private http: HttpClient,
  ) { }

  getChats(): Observable<IChat[]> {
    return this.http.get<IChat[]>(this.restUrl)
    .pipe(
      catchError((err) => 
        this.onCatchError(err, err.error.message ? err.error.message: "Can't get user chats"))
    )
  }

  createChat(payload: ICreateChatPayload): Observable<{room_id: number}> {
    return this.http.post<{room_id: number}>(this.restUrl, payload)
    .pipe(
      catchError((err) => 
        this.onCatchError(err, err.error.message ? err.error.message: "Error occured while creating a chat"))
    )
  }

  onCatchError(err: HttpErrorResponse, message: string): Observable<never> {
    if (err.status !== 403 && err.status !== 401) {
      notify({ message, type: "error", width: "auto"});
    }
    return throwError(err);
  }
}

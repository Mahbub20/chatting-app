import { HttpClient, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "src/environments/environment";

@Injectable({
    providedIn: 'root'
  })
  export class MessageService {
    readonly BaseURI = environment.apiBaseUrl;
    constructor(private http: HttpClient){

    }
    getUserReceivedMessages() {
        return this.http.get(this.BaseURI + '/message');
      }
      deleteMessage(message) {
        return this.http.post(this.BaseURI + '/message',message);
      }
    
      deleteUserChatHistory(userId: string){
        return this.http.post(this.BaseURI + `/message/deleteChatHistory/${userId}`,{});
      }
  }
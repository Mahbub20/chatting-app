import { UserService } from '../service/user.service';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { HubConnection, HubConnectionBuilder } from '@aspnet/signalr';
import { environment } from 'src/environments/environment';
import { MessageService } from '../service/message.service';
import { Guid } from 'guid-typescript';
import { ToastrService } from 'ngx-toastr';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { User } from '../models/user';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {


  loggedInUser = JSON.parse(localStorage.getItem("login-user"))
  //users:any;
  chatUser:any;

  messages: any[] = [];
  displayMessages: any[] = []
  message: string
  hubConnection: HubConnection;
  timeString: string;
  historyIconDisabled = true;

  users: User[] = [
  ];

 
  connectedUsers: any[] = []
  constructor(private router: Router, private service: UserService, private messageService: MessageService,
              private toastr: ToastrService) { }

  ngOnInit() {

     this.messageService.getUserReceivedMessages().subscribe((item:any)=>{
      debugger;
       if(item){
         this.messages=item;
         this.messages.forEach(x=>{
          x.type=x.receiver===this.loggedInUser.id?'recieved':'sent';
         })
         console.log(this.messages);
       }
     })
    
    this.service.getAll().subscribe(
      (user:any) => {
        if(user){
        this.users=user.filter(x=>x.email!==this.loggedInUser.email);
        this.users.forEach(item=>{
          item['isActive']=false;
        })
        this.makeItOnline();
        }
      },
      err => {
        console.log(err);
      },
    );




    this.message = ''
    this.hubConnection = new HubConnectionBuilder().withUrl(environment.chatHubUrl).build();
    const self = this
    this.hubConnection.start()
      .then(() => {
        self.hubConnection.invoke("PublishUserOnConnect", this.loggedInUser.id, this.loggedInUser.firstName, this.loggedInUser.userName)
          .then(() => console.log('User Sent Successfully'))
          .catch(err => console.error(err));

        this.hubConnection.on("BroadcastUserOnConnect", Usrs => {
          this.connectedUsers = Usrs;
          this.makeItOnline();
        })
        this.hubConnection.on("BroadcastUserOnDisconnect", Usrs => {
          this.connectedUsers = Usrs;
          this.users.forEach(item => {
            item.isOnline = false;
          });
          this.makeItOnline();
        })
      })
      .catch(err => console.log(err));

    // this.hubConnection.on("UserConnected", (connectionId) => this.UserConnectionID = connectionId);

    this.hubConnection.on('BroadCastDeleteMessage', (connectionId, message) => {
     let deletedMessage=this.messages.find(x=>x.id===message.id);
     if(deletedMessage){
       deletedMessage.isReceiverDeleted=message.isReceiverDeleted;
       deletedMessage.isSenderDeleted=message.isSenderDeleted;
       if(deletedMessage.isReceiverDeleted && deletedMessage.receiver===this.chatUser.id){
        this.displayMessages = this.messages.filter(x => (x.type === 'sent' && x.receiver === this.chatUser.id) || (x.type === 'recieved' && x.sender === this.chatUser.id));
       }
     }

    })

    this.hubConnection.on('ReceiveDM', (connectionId, message) => {
      console.log(message);
      message.type = 'recieved';
      this.messages.push(message);
      let curentUser = this.users.find(x => x.id === message.sender);
      this.chatUser = curentUser;
      this.users.forEach(item => {
        item['isActive'] = false;
      });
      var user = this.users.find(x => x.id == this.chatUser.id);
      user['isActive'] = true;
      this.displayMessages = this.messages.filter(x => (x.type === 'sent' && x.receiver === this.chatUser.id) || (x.type === 'recieved' && x.sender === this.chatUser.id));
    })

  }

  SendDirectMessage() {
    debugger;
    if (this.message != '' && this.message.trim() != '') {
      let guid=Guid.create();
      var msg = {
        id:guid.toString(),
        sender: this.loggedInUser.id,
        receiver: this.chatUser.id,
        messageDate: new Date(),
        type: 'sent',
        content: this.message
      };
      this.messages.push(msg);
      this.displayMessages = this.messages.filter(x => (x.type === 'sent' && x.receiver === this.chatUser.id) || (x.type === 'recieved' && x.sender === this.chatUser.id));

      this.hubConnection.invoke('SendMessageToUser', msg)
        .then(() => console.log('Message to user Sent Successfully'))
        .catch(err => console.error(err));
      this.message = '';
    }
  }

  formatMessageDate(messageDate: Date): string {
    const currentDate = new Date();
    const messageDateTime = messageDate.getTime();
    const currentDateTime = currentDate.getTime();
    
    // Calculate the difference in days
    const diffDays = Math.floor((currentDateTime - messageDateTime) / (1000 * 3600 * 24));

    if (diffDays === 0) {
        // Today
        this.timeString = `Today, ${messageDate.toLocaleTimeString()}`;
        return this.timeString;
        //return `Today, ${messageDate.toLocaleTimeString()}`;
    } else if (diffDays === 1) {
        // Yesterday
        this.timeString = `Yesterday, ${messageDate.toLocaleTimeString()}`;
        return this.timeString;
        //return `Yesterday, ${messageDate.toLocaleTimeString()}`;
    } else {
        // Other days
        this.timeString = messageDate.toLocaleDateString() + ', ' + messageDate.toLocaleTimeString();
        return this.timeString;
        //return messageDate.toLocaleDateString() + ', ' + messageDate.toLocaleTimeString();
    }
}

  openChat(user) {
    debugger;
    this.users.forEach(item => {
      item['isActive'] = false;
    });
    user['isActive'] = true;
    this.chatUser = user;
    this.displayMessages = this.messages.filter(x => (x.type === 'sent' && x.receiver === this.chatUser.id) || (x.type === 'recieved' && x.sender === this.chatUser.id));

    this.displayMessages.forEach(msg => {
      const date = new Date(msg.messageDate);
      msg.timeString = this.formatMessageDate(date);
    });

    this.messageService.getUserNumberOfMessages(user.id).subscribe(data=>{
      if(data == 0){
        user.userChatHistoryEnabled = false;
      }
      else{
        user.userChatHistoryEnabled = true;
      }
    })
  }

  makeItOnline() {
    if (this.connectedUsers && this.users) {
      this.connectedUsers.forEach(item => {
        var u = this.users.find(x => x.userName == item.username);
        if (u) {
          u.isOnline = true;
        }
      })
    }
  }
  deleteMessage(message,deleteType,isSender){
    let deleteMessage={
      'deleteType':deleteType,
      'message':message,
      'deletedUserId':this.loggedInUser.id
    }
    this.hubConnection.invoke('DeleteMessage', deleteMessage)
        .then(() => console.log('publish delete request'))
        .catch(err => console.error(err));
    message.isSenderDeleted=isSender;
    message.isReceiverDeleted=!isSender;
  }


  confirmDeleteUserChatHistory(user: any, event){
    debugger;
    event.stopPropagation();
    // console.log('user ',user);

    if (window.confirm('This cannot be undone. You will lose all chats with this user.')) {
      //Proceed with delete logic
      this.deleteUserChatHistory(user);
  } else {
      // Close the alert or do nothing
  }
  }

  deleteUserChatHistory(user: any){
    this.messageService.deleteUserChatHistory(user.id).subscribe(data=>{
      this.toastr.success('Chat history deleted successfully!');
      this.ngOnInit();
      this.getDisplayMsgs(user);
    });
  }

  getDisplayMsgs(user){
    debugger;
    this.messageService.getUserReceivedMessages().subscribe((item:any)=>{
      debugger;
       if(item.length > 0){
         //this.messages=item;
         this.displayMessages = item.filter(x => (x.type === 'sent' && x.receiver === user.id) || (x.type === 'recieved' && x.sender === user.id));
       }
       else{
        this.displayMessages = item;
       }
     })
  }

  onLogout() {
    this.hubConnection.invoke("RemoveOnlineUser", this.loggedInUser.id)
      .then(() => {
        this.messages.push('User Disconnected Successfully')
      })
      .catch(err => console.error(err));
    localStorage.removeItem('token');
    this.router.navigate(['/login']);
  }

  

}

import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { NgChartsModule } from 'ng2-charts';
import { CookieModule } from 'ngx-cookie';
import { SocketIoModule, SocketIoConfig } from 'ngx-socket-io';

import { AppComponent } from './app.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { TestareaComponent } from './components/testarea/testarea.component';
import { WordComponent } from './components/word/word.component';
import { LetterComponent } from './components/letter/letter.component';
import { FooterComponent } from './components/footer/footer.component';
import { ResultsComponent } from './components/results/results.component';
import { AppRoutingModule } from './app-routing.module';
import { AuthComponent } from './components/auth/auth.component';
import { RegisterComponent } from './components/register/register.component';
import { LoginComponent } from './components/login/login.component';
import { LeaderboardComponent } from './components/leaderboard/leaderboard.component';
import { RankingsComponent } from './components/rankings/rankings.component';
import { AdminComponent } from './components/admin/admin.component';
import { TestSourceComponent } from './components/test-source/test-source.component';
import { TestSourceWordComponent } from './components/test-source-word/test-source-word.component';
import { AdminSidebarComponent } from './components/admin-sidebar/admin-sidebar.component';
import { TestSourceQuotesComponent } from './components/test-source-quotes/test-source-quotes.component';
import { RoomsComponent } from './components/rooms/rooms.component';
import { RoomComponent } from './components/room/room.component';
import { RoomPlayersDisplayComponent } from './components/room-players-display/room-players-display.component';
import { RoomRankingsComponent } from './components/room-rankings/room-rankings.component';


const config: SocketIoConfig = { url: 'http://localhost:3001', options: {} };

@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    TestareaComponent,
    WordComponent,
    LetterComponent,
    FooterComponent,
    ResultsComponent,
    AuthComponent,
    RegisterComponent,
    LoginComponent,
    LeaderboardComponent,
    RankingsComponent,
    AdminComponent,
    TestSourceComponent,
    TestSourceWordComponent,
    AdminSidebarComponent,
    TestSourceQuotesComponent,
    RoomsComponent,
    RoomComponent,
    RoomPlayersDisplayComponent,
    RoomRankingsComponent,
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    FormsModule,
    FontAwesomeModule,
    AppRoutingModule,
    ReactiveFormsModule,
    NgChartsModule,
    CookieModule.withOptions(),
    SocketIoModule.forRoot(config)
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }

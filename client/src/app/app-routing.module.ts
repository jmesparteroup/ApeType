import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminComponent } from './components/admin/admin.component';
import { AuthComponent } from './components/auth/auth.component';
import { LeaderboardComponent } from './components/leaderboard/leaderboard.component';
import { RoomComponent } from './components/room/room.component';
import { RoomsComponent } from './components/rooms/rooms.component';
import { TestareaComponent } from './components/testarea/testarea.component';

const routes: Routes = [
  { path: '', redirectTo: '/', pathMatch: 'full' },
  { path: '', component: TestareaComponent },
  { path: 'leaderboard', component: LeaderboardComponent},
  { path: 'users', component: AuthComponent },
  { path: 'admin', component: AdminComponent },
  { path: 'battles', component: RoomsComponent },
  { path: 'battles/:id', component: RoomComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

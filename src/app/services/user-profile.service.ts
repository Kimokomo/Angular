import { Injectable } from "@angular/core";
import { AuthService } from "./auth.service";
import { Router } from "@angular/router";
import { UserInfo } from "../models/userinfo";
import { environment } from "../../environments/environment";
import { HttpClient } from "@angular/common/http";

@Injectable({
    providedIn: 'root'
})
export class UserProfileService {

    static readonly API_URL = `${environment.apiBaseUrl}`;

    remainingTime: number = 0;
    private intervalId: any

    constructor(
        private authService: AuthService,
        private router: Router,
        private http: HttpClient,
    ) { }

    public getUserInfo() {
        return this.http.get<UserInfo>(`${environment.apiBaseUrl}/auth/member/userinfo`);
    }

    public getJwtExpirationInMillis(): number | null {
        const token = this.authService.getToken();
        if (!token) return null;

        try {
            // JWT Token Aufbau: <HEADER>.<PAYLOAD>.<SIGNATURE>
            // hole Payload aus dem JWT und dekodier es mit atob() zu einem normalen JSON-String
            const payload = JSON.parse(atob(token.split('.')[1]));
            return typeof payload.exp === 'number'
                ? payload.exp * 1000 // Sek. → Millisekunden
                : null;              // Kein gültiges Ablaufdatum
        } catch (error) {
            console.error('JWT-Dekodierung fehlgeschlagen:', error);
            return null;
        }
    }

    public startTokenCountdown(): void {
        const expiration = this.getJwtExpirationInMillis();
        if (!expiration) return;

        this.intervalId = setInterval(() => {
            this.remainingTime = Math.max(0, Math.floor((expiration - Date.now()) / 1000));

            if (this.remainingTime <= 0) {
                clearInterval(this.intervalId);
                this.authService.logout();
                this.router.navigate(['/login']);
            }
        }, 1000);

        // sofortiger erster Aufruf
        this.remainingTime = Math.max(0, Math.floor((expiration - Date.now()) / 1000));
    }

    public clearJwtExpiryInterval(): void {
        if (this.intervalId) {
            clearInterval(this.intervalId);
        }
    }
}
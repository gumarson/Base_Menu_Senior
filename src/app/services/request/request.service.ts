import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class RequestService {
  private accessToken!: string;
  private tokenType!: string;
  private username!: string;
  private email!: string;
  private tenantName!: string;

  constructor() {}

  setProps(accessToken: string, tokenType: string, username: string, email: string, tenantName: string) {
    this.accessToken = accessToken;
    this.tokenType = tokenType;
    this.username = username;
    this.email = email;
    this.tenantName = tenantName;
  }
  // Métodos para retornar esses valores conforme necessário
  getAccessToken() {
    return `${this.tokenType} ${this.accessToken}`;
  }
  getUsername(){
    return this.username
  }
  getEmail(){
    return this.email
  }

  getTenantName(){
    return this.tenantName
  }

  // Outros métodos getters aqui
}

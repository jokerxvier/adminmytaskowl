import { environment } from "@/environments/environment";

export enum GlobalSettings {
  // @TODO change everywhere from GlobalSettings.BASE_URL to environment.apiUrl, or to method
  // @ts-ignore
  BASE_URL = environment.apiUrl,
  SocketURL = "https://ws.stage.mytaskowl.com/",
}

import { Mutation, MutationAction, Action, VuexModule, getModule, Module } from 'vuex-module-decorators';
import store from '@/store';

export enum StatusLevel {
    None,
    Info,
    Warning,
    Error,
}

export interface IAppState {
    status: IStatus;
    statusbar: IStatusBar;
    navbar: INavbar;
}

export interface IStatus {
    level: StatusLevel;
    message: string;
    timeoutID?: number;
}

export interface IStatusBar {
    hidden: boolean;
}

export interface INavbar {
    hidden: boolean;
}

@Module({ dynamic: true, store, name: 'app', namespaced: true})
class App extends VuexModule implements IAppState {
    public status: IStatus = {
        level: StatusLevel.None,
        message: '',
        timeoutID: undefined,
    };
    public statusbar: IStatusBar = {
        hidden: true,
    };
    public navbar: INavbar = {
        hidden: false,
    };

    @Action
    public setStatus(status: IStatus): void {
        clearTimeout(this.status.timeoutID); // 自動非表示のためのタイマーを無効化

        this.SET_STATUS(status); // StatusBarに値が入る
        this.SHOW_STATUS_BAR(); // StatusBarが表示される

        if (status.level === StatusLevel.Info) {
            // 3秒後に自動非表示
            const timeoutID = setTimeout(() => {
                this.resetStatus();
            }, 3000);
            this.SET_STATUS_TIMEOUT_ID(timeoutID);
        }
    }

    @Action
    public resetStatus(): void {
        this.HIDE_STATUS_BAR(); // StatusBarが300ms秒かけて隠れる（ref. StatusBarのhidden class）
        setTimeout(() => {
            this.RESET_STATUS(); // 300ms秒後にStatusBarから値が消える
        }, 300);
    }

    @Action
    public showNavbar(): void {
        this.SHOW_NAVBAR();
    }

    @Action
    public hideNavbar(): void {
        this.HIDE_NAVBAR();
    }

    @Mutation
    private SET_STATUS(status: IStatus): void {
        this.status.level = status.level;
        this.status.message = status.message;
    }

    @Mutation
    private SET_STATUS_TIMEOUT_ID(timeoutID: number): void {
        this.status.timeoutID = timeoutID;
    }

    @Mutation
    private RESET_STATUS(): void {
        this.status.level = StatusLevel.None;
        this.status.message = '';
    }

    @Mutation
    private SHOW_STATUS_BAR(): void {
        this.statusbar.hidden = false;
    }

    @Mutation
    private HIDE_STATUS_BAR(): void {
        this.statusbar.hidden = true;
    }

    @Mutation
    private SHOW_NAVBAR(): void {
        this.navbar.hidden = false;
    }

    @Mutation
    private HIDE_NAVBAR(): void {
        this.navbar.hidden = true;
    }
}

export default getModule(App);

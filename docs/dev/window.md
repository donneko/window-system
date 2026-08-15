## 要件
- web サイト上でサーバーなどの管理画面を作成するウィンドウ
- ウィンドウを生成して、ウィンドウの管理を行う
- ウィンドウで表示するのはウェブサイトのデータ

### ウィンドウの要素
- タイトル
- バツボタン
- 要素表示


### ウィンドウの表示するものについて
- ウェブサイト
- URL指定のみ
- iFrame
- 権限は全て与える

### その他
- ウィンドウに表示するものについては、責任を取らない
- ウィンドウの生成と状態の管理のみを責任を取る
- ウィンドウの状態を取得して、あとで復元できるようにるう

## 詳細設計

### 全体図

ユーザー　→　ウィンドウの全体を管理　→　ウィンドウの一つを管理するクラス


### ウィンドウの全体を管理
#### api

- create - ウィンドウを作成する
- delete - ウィンドウを消去する
- change - ウィンドウのデータを変更する
- window - 指定したウィンドウのデータを取得する
- allWindow - 全てのウィンドウを取得する

#### 引数・戻り値

##### create
###### 引数
- `config`
###### 戻り値
- 作成したウィンドウの `id`
##### change
###### 引数
- `id`
- `config`
###### 戻り値
- `void`
##### window
###### 引数
- `id`
###### 戻り値
- `config`
##### allWindow
###### 引数
- `void`
###### 戻り値
- `config[]`


### ウィンドウの一つを管理するクラス

#### 初期化時
ウィンドウの設定を適用する

##### 引数
- `config`

#### api

- delete - ウィンドウを消去する
- change - ウィンドウのデータを変更する
- getConfig - ウィンドウのデータを取得する


#### 引数・戻り値

##### delete
###### 引数
- `void`
###### 戻り値
- `void`

##### change
###### 引数
- `config`
###### 戻り値
- `void`

##### getConfig
###### 引数
- `void`
###### 戻り値
- `config`

### ウィンドウのデータのタイプとか

#### `config` - `window-config.type.ts`
```ts
export type DisplayType = "auto" | "scroll" | "stint";

export type WindowConfig = {
    id: string;
    title: string;
    titleDisplayType: DisplayType;

    icon:URL;

    baseElement: HTMLElement;

    content:URL;

    x: number;
    y: number;
    width: number;
    height: number;
    zIndex: number;

    minWidth: number;
    minHeight: number;
    maxWidth: number;
    maxHeight: number;

    movable: boolean;
    resizable: boolean;
    closable: boolean;
};
```

#### `event` - `window-event.type.ts`
```ts
export type WindowEvents = {

};
```

#### `status` - `window-status.type.ts`
```ts
export type WindowStatus = {
    isActive: boolean;
    isMinimized: boolean;
    isMaximized: boolean;
    isHidden: boolean;
};
```
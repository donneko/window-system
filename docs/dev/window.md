# WindowSystem 設計・利用ガイド

## 構成

WindowSystemは次の二層で構成されています。

- `WindowManager`: ID、全ウィンドウ、アクティブ状態、z-index、公開APIを管理
- `WindowSystem`: 単一ウィンドウのDOM、iframe、移動、リサイズ、表示状態を管理

ライブラリをimportしただけではDOMへアクセスしません。`createWindowSystem()` を呼び出した時点で配置先を解決します。

## 公開API

```ts
const api = createWindowSystem({ baseElement?: HTMLElement });

api.create(configOrSnapshot): string;
api.delete(id): void;
api.change(id, patch): void;
api.window(id): WindowSnapshot;
api.allWindow(): WindowSnapshot[];
```

存在しないID、重複ID、不正なURLやサイズ制約には `WindowSystemError` を投げます。

### create

```ts
const id = api.create({
    id: "server-console",       // 省略時は自動生成
    title: "Server console",
    titleDisplayType: "auto",  // auto | scroll | stint
    iconUrl: "/icons/server.png",
    contentUrl: "/console/index.html",
    x: 20,
    y: 20,
    width: 640,
    height: 400,
    minWidth: 320,
    minHeight: 180,
    maxWidth: 1200,             // nullなら上限なし
    maxHeight: null,
    movable: true,
    resizable: true,
    closable: true,
    status: {
        isActive: true,
        isMinimized: false,
        isMaximized: false,
        isHidden: false,
    },
});
```

`contentUrl` は `document.baseURI` を基準に絶対URLへ正規化します。対応プロトコルはHTTP、HTTPS、about、Blobです。iframeに独自sandboxは追加しません。

### change

`create` と同じ項目を部分更新できます。ただしIDは変更できません。

```ts
api.change(id, {
    x: 100,
    y: 80,
    movable: false,
    status: { isMinimized: true },
});
```

最大化すると元の位置とサイズが `restoreBounds` に保存されます。最大化解除時とJSON復元後の解除時に同じ領域へ戻ります。最小化と最大化を同時に有効にはできません。

### window / allWindow

`window` は指定IDのコピー、`allWindow` はz-index昇順のコピーを返します。戻り値を変更しても内部状態は変化しません。

```ts
const snapshot = api.window(id);
const serialized = JSON.stringify(api.allWindow());
```

スナップショットはJSON直列化可能で、各要素をz-index昇順に `create` へ渡すと重なり順とアクティブ状態も復元されます。

## 操作

- ヘッダーの左ボタンドラッグで移動
- 上下左右と四隅のドラッグでリサイズ
- ウィンドウを押すと最前面化
- `movable`、`resizable`、`closable` がfalseなら対応操作を無効化
- Pointer Captureはpointerup、pointercancel、削除時に解放

## スタイル

配布CSSを必ず読み込みます。

```ts
import "@donneko/window-system/window-style.css";
```

独自の配置先を使う場合は次のように表示領域を定義します。

```css
#desktop {
    position: relative;
    width: 100%;
    height: 100vh;
    overflow: hidden;
}
```

## 制約

- iframe先のCSP、`X-Frame-Options`、同一生成元ポリシーは回避しません。
- LocalStorageなどへの永続化は利用側で実装します。
- HTML文字列のBlob変換、共有Blobキャッシュ、旧版の `addWindow` / `chenge*` APIは提供しません。

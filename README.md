# WindowSystem

Webページ上で複数のウィンドウを作成・管理するTypeScriptライブラリです。

## 機能

- 複数ウィンドウの作成、変更、削除、状態取得
- Pointer Eventsによる移動と8方向リサイズ
- アクティブウィンドウとz-indexの自動管理
- URLを読み込むiframe
- 最小化、最大化、非表示とJSONスナップショット

## インストールとビルド

```bash
npm install
npm run build
```

ブラウザで利用する場合はJavaScriptとCSSの両方を読み込みます。

```ts
import { WindowManager } from "@donneko/window-system";
import "@donneko/window-system/window-style.css";

const windows = new WindowManager();

const id = windows.createWindow({
    title: "管理画面",
    contentUrl: "/admin/index.html",
    x: 40,
    y: 40,
    width: 640,
    height: 420,
    minWidth: 320,
    minHeight: 180,
});

windows.updateWindow(id, {
    title: "更新済み",
    status: { isMaximized: true },
});
```

配置先を指定する場合、その要素には通常 `position: relative` と表示領域のサイズを設定します。

```ts
const windows = new WindowManager({
    container: document.querySelector<HTMLElement>("#desktop")!,
});
```

## 状態の保存と復元

`WindowSnapshot` はDOMを含まないため、そのままJSONへ保存できます。

```ts
localStorage.setItem("windows", JSON.stringify(windows.getWindows()));

const snapshots = JSON.parse(localStorage.getItem("windows") ?? "[]");
for (const snapshot of snapshots) {
    windows.createWindow(snapshot);
}
```

保存先の管理は利用側の責任です。URLのページがiframe表示を拒否する場合は、そのページのCSPまたは `X-Frame-Options` に従います。

詳細は [開発ドキュメント](docs/dev/window.md) を参照してください。


## License

MIT

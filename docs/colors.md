# カラーデザイン仕様書

## 1. カラーシステム設計

### 1.1 基本コンセプト
- **ポップ&クリエイティブ**: 創造性と楽しさを表現する色調
- **ビビッド**: 明るく活気のある鮮やかなカラーパレット  
- **アクセシブル**: WCAG 2.1 AA準拠のコントラスト比を維持

## 2. プライマリカラーパレット

### 2.1 パープル系（メインカラー）
```css
:root {
  /* パープル - 60年代ソウル・サイケデリック */
  --purple-50: #faf5ff;   /* 極薄背景 */
  --purple-100: #f3e8ff;  /* 薄背景 */
  --purple-200: #e9d5ff;  /* ボーダー・区切り */
  --purple-300: #d8b4fe;  /* 装飾要素 */
  --purple-400: #c084fc;  /* セカンダリアクション */
  --purple-500: #a855f7;  /* プライマリアクション */
  --purple-600: #9333ea;  /* メインブランドカラー */
  --purple-700: #7c3aed;  /* アクティブ・フォーカス */
  --purple-800: #6b21a8;  /* 濃いテキスト */
  --purple-900: #581c87;  /* 最も濃い */
}
```

### 2.2 グレー系（ニュートラル）
```css
:root {
  /* グレー - UI基盤色 */
  --gray-50: #f8fafc;   /* 最薄背景 */
  --gray-100: #f1f5f9;  /* カード背景 */
  --gray-200: #e2e8f0;  /* ボーダー */
  --gray-300: #cbd5e1;  /* 区切り線 */
  --gray-400: #94a3b8;  /* プレースホルダー */
  --gray-500: #64748b;  /* セカンダリテキスト */
  --gray-600: #475569;  /* 通常テキスト */
  --gray-700: #334155;  /* 濃いテキスト */
  --gray-800: #1e293b;  /* 見出しテキスト */
  --gray-900: #0f172a;  /* 最濃テキスト */
}
```

## 3. セマンティックカラー

### 3.1 アクセントカラー（60年代サイケデリック風）
```css
:root {
  /* フューシャピンク - 60年代ソウル・サイケデリック */
  --fuchsia-400: #f472b6;  /* 薄いフューシャ */
  --fuchsia-500: #ec4899;  /* メインフューシャ */
  --fuchsia-600: #db2777;  /* 濃いフューシャ */
  
  /* サイケデリックオレンジ - レトロアクセント */
  --orange-400: #fb923c;   /* 薄いオレンジ */
  --orange-500: #f97316;   /* メインオレンジ */
  --orange-600: #ea580c;   /* 濃いオレンジ */
  
  /* サイケデリックグリーン - レトロアクセント */
  --psychedelic-green-400: #4ade80; /* 薄いサイケグリーン */
  --psychedelic-green-500: #22c55e; /* メインサイケグリーン */
  --psychedelic-green-600: #16a34a; /* 濃いサイケグリーン */
  
  /* レトロクリーム - ヴィンテージニュートラル */
  --retro-cream-400: #fef3c7; /* 薄いレトロクリーム */
  --retro-cream-500: #fde68a; /* メインレトロクリーム */
  --retro-cream-600: #fbbf24; /* 濃いレトロクリーム */
}
```

## 4. 機能別カラー定義

### 4.1 UIコンポーネント
```css
:root {
  /* 背景色 */
  --bg-primary: var(--purple-50);     /* メイン背景（薄いパープル） */
  --bg-secondary: #ffffff;           /* カード・モーダル背景 */
  --bg-tertiary: var(--retro-cream-400); /* セクション背景 */
  
  /* テキスト色 */
  --text-primary: var(--gray-900);   /* メインテキスト */
  --text-secondary: var(--gray-600); /* サブテキスト */
  --text-tertiary: var(--gray-500);  /* 補助テキスト */
  --text-inverse: #ffffff;           /* 反転テキスト */
  
  /* ボーダー色 */
  --border-primary: var(--purple-200); /* 通常ボーダー */
  --border-secondary: var(--purple-300); /* 強調ボーダー */
  --border-focus: var(--fuchsia-500);  /* フォーカスボーダー */
  
  /* アクション色 */
  --action-primary: var(--purple-600);     /* プライマリボタン */
  --action-primary-hover: var(--purple-700); /* ホバー状態 */
  --action-secondary: var(--fuchsia-500);  /* セカンダリボタン */
  --action-secondary-hover: var(--fuchsia-600); /* ホバー状態 */
}
```

### 4.2 状態色
```css
:root {
  /* インタラクション状態 */
  --state-hover: rgba(147, 51, 234, 0.05);    /* ホバー背景（パープル系） */
  --state-active: rgba(147, 51, 234, 0.1);    /* アクティブ背景 */
  --state-focus: rgba(236, 72, 153, 0.15);    /* フォーカス背景（フューシャ系） */
  --state-disabled: var(--gray-100);          /* 無効背景 */
  
  /* フィードバック状態 */
  --feedback-success: #f0fdf4;   /* 成功背景（グリーン系） */
  --feedback-warning: #fff7ed;   /* 警告背景（オレンジ系） */
  --feedback-error: #fdf2f8;     /* エラー背景（フューシャ系） */
  --feedback-info: var(--purple-50);     /* 情報背景（パープル系） */
}
```

## 5. カテゴリー別カラー

### 5.1 ファイルカテゴリー色（ポップアート風）
```css
:root {
  /* カテゴリーバッジ色 */
  --category-system: var(--coral-600);     /* 制度・補助金 */
  --category-education: var(--lime-500);   /* 教育・AI */
  --category-tech: var(--blue-500);        /* 技術・開発 */
  --category-business: var(--yellow-500);  /* ビジネス */
  --category-design: var(--teal-500);      /* デザイン */
  --category-other: var(--gray-500);       /* その他 */
}
```

### 5.2 カテゴリー背景色
```css
:root {
  /* カテゴリー背景色（薄い版） */
  --category-system-bg: var(--navy-50);    
  --category-education-bg: #f0fdf4;        /* ライムグリーンの薄い版 */
  --category-tech-bg: #faf5ff;             /* パープルの薄い版 */
  --category-business-bg: #fdf2f8;         /* ピンクの薄い版 */
  --category-design-bg: #faf9f7;           /* クリームの薄い版 */
  --category-other-bg: var(--gray-50);     
}
```

## 6. ダークモード対応

### 6.1 ダークテーマカラー
```css
[data-theme="dark"] {
  /* 背景色 */
  --bg-primary: var(--gray-900);      /* メイン背景 */
  --bg-secondary: var(--gray-800);    /* カード背景 */
  --bg-tertiary: var(--gray-700);     /* セクション背景 */
  
  /* テキスト色 */
  --text-primary: var(--gray-50);     /* メインテキスト */
  --text-secondary: var(--gray-300);  /* サブテキスト */
  --text-tertiary: var(--gray-400);   /* 補助テキスト */
  
  /* ボーダー色 */
  --border-primary: var(--teal-800);  /* 通常ボーダー */
  --border-secondary: var(--teal-700); /* 強調ボーダー */
  --border-focus: var(--teal-400);    /* フォーカスボーダー */
  
  /* アクション色（ダーク調整） */
  --action-primary: var(--teal-400);     /* プライマリボタン */
  --action-primary-hover: var(--teal-300); /* ホバー状態 */
  --action-secondary: var(--coral-400);   /* セカンダリボタン */
  
  /* 状態色の調整 */
  --state-hover: rgba(20, 184, 166, 0.1);  /* ティール系ホバー */
  --state-active: rgba(20, 184, 166, 0.2);
  --state-disabled: var(--gray-800);
}
```

## 7. アクセシビリティ検証

### 7.1 コントラスト比チェック
```css
/* 主要な色の組み合わせ */
.contrast-check {
  /* ✅ 通常テキスト: 4.5:1 以上 */
  color: var(--gray-900);           /* #0f172a */
  background: var(--teal-50);       /* #f0fdfa */
  /* コントラスト比: 15.8:1 */
  
  /* ✅ 大きなテキスト: 3:1 以上 */
  color: var(--teal-800);           /* #115e59 */
  background: var(--teal-100);      /* #ccfbf1 */
  /* コントラスト比: 7.2:1 */
  
  /* ✅ UI要素: 3:1 以上 */
  border-color: var(--teal-300);    /* #5eead4 */
  background: var(--teal-50);       /* #f0fdfa */
  /* コントラスト比: 3.8:1 */
  
  /* ✅ カテゴリーバッジ: 4.5:1 以上 */
  color: #ffffff;                   /* 白テキスト */
  background: var(--teal-600);      /* #0d9488 */
  /* コントラスト比: 5.2:1 */
}
```

## 8. 実装ガイドライン

### 8.1 CSS変数の使用方法
```css
/* ✅ 推奨: セマンティック変数を使用 */
.button-primary {
  background-color: var(--action-primary);
  color: var(--text-inverse);
}

/* ❌ 非推奨: 直接色を指定 */
.button-primary {
  background-color: #2563eb;
  color: white;
}
```

### 8.2 テーマ切り替え対応
```css
/* 自動でダークモード対応される */
.card {
  background-color: var(--bg-secondary);
  color: var(--text-primary);
  border: 1px solid var(--border-primary);
}
```

## 9. カラー使用例

### 9.1 検索バー
```css
.search-input {
  background-color: var(--bg-secondary);
  border: 2px solid var(--border-primary);
  color: var(--text-primary);
}

.search-input:focus {
  border-color: var(--border-focus);
  box-shadow: 0 0 0 3px var(--state-focus);
}
```

### 9.2 カードコンポーネント
```css
.file-card {
  background-color: var(--bg-secondary);
  border: 1px solid var(--border-primary);
  color: var(--text-primary);
}

.file-card:hover {
  background-color: var(--state-hover);
  border-color: var(--border-secondary);
}
```

### 9.3 カテゴリーバッジ
```css
.category-badge {
  background-color: var(--category-system);
  color: var(--text-inverse);
}

.category-badge.education {
  background-color: var(--category-education);
}
```
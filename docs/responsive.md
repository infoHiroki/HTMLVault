# レスポンシブデザイン仕様書

## 1. ブレイクポイント戦略

### 1.1 デバイス分類
```css
/* モバイル（デフォルト） */
@media (max-width: 768px) { /* ~768px */ }

/* タブレット */
@media (min-width: 769px) and (max-width: 1024px) { /* 769px~1024px */ }

/* デスクトップ */
@media (min-width: 1025px) { /* 1025px~ */ }
```

### 1.2 コンテナ幅設計
```css
.container {
  width: 100%;
  margin: 0 auto;
  padding: 0 16px; /* モバイル */
}

@media (min-width: 769px) {
  .container {
    max-width: 1024px;
    padding: 0 24px; /* タブレット */
  }
}

@media (min-width: 1025px) {
  .container {
    max-width: 1200px;
    padding: 0 32px; /* デスクトップ */
  }
}
```

## 2. グリッドシステム

### 2.1 カードグリッド
```css
.card-grid {
  display: grid;
  gap: 16px; /* モバイル */
  grid-template-columns: 1fr; /* モバイル: 1列 */
}

@media (min-width: 769px) {
  .card-grid {
    gap: 24px; /* タブレット */
    grid-template-columns: repeat(2, 1fr); /* タブレット: 2列 */
  }
}

@media (min-width: 1025px) {
  .card-grid {
    gap: 32px; /* デスクトップ */
    grid-template-columns: repeat(3, 1fr); /* デスクトップ: 3列 */
  }
}
```

### 2.2 動的グリッド（将来拡張用）
```css
/* 自動調整グリッド */
.auto-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: clamp(16px, 2vw, 32px);
}
```

## 3. コンポーネント別レスポンシブ

### 3.1 ヘッダー
```css
.header {
  height: 60px; /* モバイル */
  padding: 0 16px;
}

@media (min-width: 1025px) {
  .header {
    height: 80px; /* デスクトップ */
    padding: 0 32px;
  }
}
```

### 3.2 検索バー
```css
.search-container {
  width: 100%; /* モバイル: 全幅 */
  margin: 0 auto;
}

@media (min-width: 769px) {
  .search-container {
    max-width: 500px; /* タブレット: 制限幅 */
  }
}

@media (min-width: 1025px) {
  .search-container {
    max-width: 600px; /* デスクトップ: さらに制限 */
  }
}

.search-input {
  font-size: 16px; /* iOS zoom防止 */
  padding: 12px 16px;
  height: 48px;
}

@media (min-width: 1025px) {
  .search-input {
    font-size: 18px;
    padding: 16px 20px;
    height: 56px;
  }
}
```

### 3.3 ナビゲーションメニュー
```css
/* モバイル: ハンバーガーメニュー */
@media (max-width: 768px) {
  .nav-menu {
    position: fixed;
    top: 0;
    right: -100%;
    width: 280px;
    height: 100vh;
    background: var(--bg-primary);
    transition: right 0.3s ease-out;
    z-index: 1000;
  }
  
  .nav-menu.open {
    right: 0;
  }
  
  .hamburger {
    display: block;
  }
}

/* デスクトップ: 常時表示 */
@media (min-width: 769px) {
  .nav-menu {
    position: static;
    width: auto;
    height: auto;
    background: transparent;
    display: flex;
  }
  
  .hamburger {
    display: none;
  }
}
```

## 4. タイポグラフィレスポンシブ

### 4.1 フルードタイポグラフィ
```css
:root {
  /* clamp(最小値, 推奨値, 最大値) */
  --font-size-xs: clamp(0.75rem, 0.7rem + 0.25vw, 0.875rem);   /* 12px~14px */
  --font-size-sm: clamp(0.875rem, 0.8rem + 0.375vw, 1rem);    /* 14px~16px */
  --font-size-base: clamp(1rem, 0.9rem + 0.5vw, 1.125rem);    /* 16px~18px */
  --font-size-lg: clamp(1.125rem, 1rem + 0.625vw, 1.25rem);   /* 18px~20px */
  --font-size-xl: clamp(1.25rem, 1.1rem + 0.75vw, 1.5rem);    /* 20px~24px */
}
```

### 4.2 行間・文字間隔
```css
body {
  line-height: 1.6; /* モバイル: 読みやすい行間 */
  letter-spacing: 0.02em;
}

@media (min-width: 1025px) {
  body {
    line-height: 1.5; /* デスクトップ: 少し詰める */
    letter-spacing: 0.01em;
  }
}
```

## 5. スペーシングシステム

### 5.1 スペーシングスケール
```css
:root {
  /* 基本スペーシング（rem単位） */
  --space-xs: 0.25rem;  /* 4px */
  --space-sm: 0.5rem;   /* 8px */
  --space-md: 1rem;     /* 16px */
  --space-lg: 1.5rem;   /* 24px */
  --space-xl: 2rem;     /* 32px */
  --space-2xl: 3rem;    /* 48px */
  
  /* レスポンシブスペーシング */
  --section-padding: clamp(1rem, 4vw, 2rem);     /* 16px~32px */
  --card-padding: clamp(1rem, 3vw, 1.5rem);      /* 16px~24px */
  --content-gap: clamp(1rem, 2vw, 2rem);         /* 16px~32px */
}
```

## 6. モバイル最適化

### 6.1 タッチターゲット
```css
/* 最小タップ領域: 44px × 44px */
.btn, .card, .nav-link {
  min-height: 44px;
  min-width: 44px;
  padding: 12px 16px;
}

/* カードタップ領域拡張 */
.file-card {
  position: relative;
  cursor: pointer;
}

.file-card::after {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 1;
}
```

### 6.2 iOS対応
```css
/* Safariのズーム無効化 */
input[type="search"] {
  font-size: 16px; /* 16px未満だとズームされる */
  -webkit-appearance: none;
}

/* Safe Area対応 */
.header {
  padding-top: env(safe-area-inset-top);
}

.footer {
  padding-bottom: env(safe-area-inset-bottom);
}
```

## 7. パフォーマンス最適化

### 7.1 CSS最適化
```css
/* GPU加速によるアニメーション */
.card {
  transform: translateZ(0); /* ハードウェア加速有効化 */
  will-change: transform;   /* 最適化ヒント */
}

.card:hover {
  transform: translateY(-4px) translateZ(0);
}

/* containプロパティでレイアウト最適化 */
.card-grid {
  contain: layout style;
}
```

### 7.2 画像レスポンシブ
```css
/* 将来の画像対応 */
.card-image {
  width: 100%;
  height: auto;
  aspect-ratio: 16/9;
  object-fit: cover;
}

/* 高解像度ディスプレイ対応 */
@media (-webkit-min-device-pixel-ratio: 2), (min-resolution: 192dpi) {
  .card-image {
    image-rendering: -webkit-optimize-contrast;
  }
}
```

## 8. デバッグ・テスト

### 8.1 ブレイクポイント可視化（開発用）
```css
/* 開発時のブレイクポイント表示 */
body::before {
  content: "Mobile";
  position: fixed;
  top: 0;
  left: 0;
  background: red;
  color: white;
  padding: 4px 8px;
  font-size: 12px;
  z-index: 9999;
}

@media (min-width: 769px) {
  body::before { content: "Tablet"; background: orange; }
}

@media (min-width: 1025px) {
  body::before { content: "Desktop"; background: green; }
}
```

### 8.2 テストチェックリスト
- [ ] iPhone SE (375px) での表示確認
- [ ] iPad (768px) での表示確認  
- [ ] 一般的なデスクトップ (1200px+) での表示確認
- [ ] 横向き・縦向き両方でのテスト
- [ ] タッチ操作の快適性確認
- [ ] フォントサイズの可読性確認
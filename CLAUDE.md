# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 概要

HTMLVaultは、HTMLドキュメントファイルを整理・表示するモバイルファーストの静的ファイル管理システムです。**「Simple, Instant, Intuitive」**のコンセプトでバニラJavaScriptを使用し、フレームワークの依存関係なしで1960年代サイケデリック風のポップなデザインが特徴です。

## システムアーキテクチャ

### 設計原則
- **モバイルファーストレスポンシブデザイン**
- **JSON中心のファイル管理**（v2.0.0で導入）
- **ブラウザセキュリティ制約内での動作**（GitHub Pages対応）
- **WCAG 2.1 AA準拠**のアクセシビリティ

### コアファイル構成
- **`index.html`** - 検索・フィルタリング・レスポンシブカードレイアウトのメインアプリ
- **`files.json`** - 全HTMLファイルの中央メタデータストア（手動更新必須）
- **`html-files/`** - 管理対象HTMLファイル専用ディレクトリ
- **`tests/`** - カスタムテストフレームワークによるブラウザベーステストスイート

### データフローと技術制約
1. `files.json`に全ファイルメタデータを集約管理
2. ページロード時に`files.json`を非同期読み込み
3. リアルタイム検索（300msデバウンス）でカード動的レンダリング
4. **重要**: ブラウザセキュリティによりファイル自動検出は不可能（GitHub Pages制約）

## 開発・テストコマンド

```bash
# ローカル開発サーバー起動
python -m http.server 8000
python3 -m http.server 8000
npx serve .

# テスト実行
# http://localhost:8000/tests/test-runner.html をブラウザで開く
```

## ファイル管理ワークフロー

### 新規ファイル追加手順
1. **HTMLファイル配置**: `html-files/`ディレクトリに配置
2. **命名規則遵守**: `{YYYY-MM-DD}-{category}-{description}.html`
3. **files.json更新**: 以下形式でエントリ追加

```json
{
  "id": "unique-identifier",
  "path": "html-files/filename.html",
  "title": "表示タイトル",
  "description": "簡単な説明",
  "tags": ["タグ1", "タグ2"],
  "created": "2025-07-03",
  "category": "技術・開発"
}
```

### 命名規則詳細
- **日付形式**: YYYY-MM-DD
- **カテゴリ略称**: `system`, `edu`, `tech`, `design`, `biz`, `misc`
- **説明部分**: 英数字・ローマ字のみ、ハイフン区切り、20文字以内
- **例**: `2025-06-26-tech-go-tutorial.html`

### 使用可能カテゴリ
- **`制度・補助金`** (`system`) - 政府制度、補助金関連
- **`教育・AI`** (`edu`) - 教育、AI・機械学習関連
- **`技術・開発`** (`tech`) - プログラミング、開発技術
- **`デザイン`** (`design`) - UI/UX、グラフィックデザイン
- **`ビジネス`** (`biz`) - ビジネス、マーケティング
- **`医療・健康`** - 医療・ヘルスケア関連
- **`システム・導入`** - システム導入・運用
- **`その他`** (`misc`) - 上記以外

## デザインシステム

### カラーパレット（CSS変数使用）
- **メインカラー**: Purple系 (`--purple-600: #9333ea`)
- **アクセントカラー**: 
  - Fuchsia Pink (`--fuchsia-500: #ec4899`)
  - Psychedelic Orange (`--orange-500: #f97316`)
  - Psychedelic Green (`--psychedelic-green-500: #22c55e`)
  - Retro Cream (`--retro-cream-500: #fde68a`)

### レスポンシブブレークポイント
- **モバイル**: 〜768px（1カラム）
- **タブレット**: 769px〜1024px（2カラム）
- **デスクトップ**: 1025px〜（3カラム）

### UI/UX要件
- **パフォーマンス目標**: 
  - First Contentful Paint < 1.5s
  - Largest Contentful Paint < 2.5s
  - Cumulative Layout Shift < 0.1
- **タッチ最適化**: 最小タップターゲット44px
- **キーボードナビゲーション**: Tab, Enter, Escape, 矢印キー対応
- **アニメーション**: 0.3s以下でUX最適化

## 技術的制約と解決策

### 主要制約
- **ブラウザセキュリティ**: ファイルシステム直接アクセス不可
- **GitHub Pages**: サーバーサイド処理不可
- **自動検出限界**: 完全自動化は不可能

### 採用解決策
- **JSON設定方式**: 手動メンテナンスだが確実
- **スマートフォールバック**: `files.json`優先、レガシーパターン検出補完
- **ヘルパーツール**: `file-helper.html`でJSON生成支援（現在未実装）

## 重要な開発注意事項

- **files.json必須更新**: 新ファイル追加時の手動更新必須
- **命名規則遵守**: SEOとファイル管理の一貫性確保
- **モバイルファースト**: 全修正はモバイルビューから開始
- **アクセシビリティ**: WCAG 2.1 AA準拠維持
- **パフォーマンス**: GPU加速アニメーション使用
- **バージョン**: 現在v2.0.0（2025-06-26）
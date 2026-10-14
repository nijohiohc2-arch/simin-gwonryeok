# 시민권력 OS (가칭) — 프로토타입

**라이브(예시):** https://simin-gwonryeok.netlify.app

> ⚠️ 모든 의제·인물·기관·수치는 **예시 데이터**입니다. 실제 서명·투표·청원이 아니며, 후보 지지·모금·토큰 기능이 없습니다. 이 저장소는 보관용 사본이며 배포와 연결되어 있지 않습니다.

이 프로토타입은 "위임한 힘을, 다시 시민에게"라는 흐름을 보여줍니다. 시민이 제안하면 공개 기준 검토와 카드 공론장을 거쳐 시민 합의안이 됩니다. 그다음 함께하기(실행팀), 공동 실행실, 결과 공개로 이어집니다. 설계 배경은 `UNIFIED_SPEC.md`에 있습니다.

- 모든 데이터는 예시이고, 백엔드가 없습니다. 로그인, 카드 응답, 공감, 실행팀 참여, 제안은 모두 브라우저 localStorage에만 저장됩니다.
- 후보 지지, 모금, 토큰, 지갑, 전자서명 기능이 없습니다. 실명·지역 명단도 공개하지 않습니다.
- 히어로 이미지는 AI로 만든 상징 이미지이며, 실제 집회나 인물이 아닙니다.

## 실행 / 빌드
```bash
npm install
npm run dev            # 개발 서버
npm run lint
npm run build          # 정적 사이트 출력: out/  (next.config.mjs: output "export")
python3 -m http.server 3420 -d out   # out/ 미리보기
python3 shots_final.py               # (3420에서 서빙 중일 때) screenshots/final/ 다시 생성
```
배포할 때(현재는 하지 않음)는 Netlify에서 빌드 명령을 `npm run build`, 게시 폴더를 `out`으로 설정하면 됩니다. 실제 도메인이 정해지면 `NEXT_PUBLIC_SITE_URL`을 설정해야 OG 이미지 URL이 올바르게 나옵니다. 지금은 robots를 noindex로 설정해 두었습니다.

## 라우트
`/` · `/issues` (?stage=) · `/issues/[id]` · `/propose` · `/deliberate/[id]` · `/agreement/[id]` · `/room/[id]` · `/results/[id]` · `/about` · `/principles` · `/me` · 404

예시 의제는 8개입니다(`src/lib/data.ts`). 의제마다 모든 단계 라우트가 생성됩니다. 아직 그 단계에 도달하지 않은 의제는 "아직 ○○ 단계 전이에요" 안내와 함께 현재 단계로 이동하는 링크를 보여줍니다.

## 실제 로그인·저장 (준비됨, 미연결)
- `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`가 있으면 카카오 로그인(Supabase Auth) + 참여 기록 DB 저장, 없으면 localStorage 모드.
- 스키마: `supabase/migrations/20261012000000_init.sql` (RLS 본인 행만, 공개는 `issue_counts()` 숫자만, `delete_me()` 탈퇴)
- 설정 안내: `KAKAO_SETUP.md`

# 카카오 로그인 + Supabase 연결 가이드 (시민권력 OS)

> 현재 상태(2026.10.12): 코드와 DB 스키마는 준비됐지만 **Supabase 새 프로젝트를 아직 만들지 못했어요.** 무료 플랜은 활성 프로젝트가 계정당 2개까지인데, 이미 다른 프로젝트 두 개가 활성 상태예요. 아래 0단계부터 진행해 주세요.
> 아래 `<REF>`는 0단계에서 만든 프로젝트의 Reference ID(20자 영문)로 바꿔 읽으세요.

## 0. Supabase 프로젝트 자리 만들기 (택1)
- A) 쓰지 않는 프로젝트 일시정지: Supabase 대시보드에서 쓰지 않는 기존 프로젝트의 Settings > General → **Pause project**
- B) 조직을 유료(Pro) 플랜으로 변경 → 비용이 발생하므로 직접 판단
- 자리가 생기면 봇에게 “Supabase 자리 비웠어”라고 알려주면 `simin-gwonryeok`(서울 ap-northeast-2) 프로젝트 생성 → 마이그레이션(`supabase/migrations/20261012000000_init.sql`) 적용 → 보안 점검 → Netlify 환경변수 설정 → 재배포까지 진행해요.

## 1. 카카오 개발자 앱 만들기
1. https://developers.kakao.com 로그인 → 상단 **내 애플리케이션** → **애플리케이션 추가하기**
2. 앱 이름: `시민권력 OS`, 회사명: 본인/단체명 → 저장
3. **앱 설정 > 플랫폼 > Web 플랫폼 등록** → 사이트 도메인: `https://simin-gwonryeok.netlify.app`

## 2. 카카오 로그인 켜기
1. **제품 설정 > 카카오 로그인** → 활성화 설정 **ON**
2. **Redirect URI 등록**:
   ```
   https://<REF>.supabase.co/auth/v1/callback
   ```
   (카카오가 돌려보내는 곳은 우리 사이트가 아니라 Supabase예요. 정확히 위 주소 한 줄만)
3. **제품 설정 > 카카오 로그인 > 동의항목**
   - **닉네임(profile_nickname)**: 필수 동의 → 목적: “서비스 내 공개 별칭”
   - 프로필 사진, 카카오계정(이메일): **설정하지 않음** (이메일은 비즈 앱 전환이 필요하고, 우리는 수집하지 않아요)

## 3. 키 확인
1. **앱 설정 > 앱 키** → **REST API 키** 복사 (= Client ID)
2. **제품 설정 > 카카오 로그인 > 보안** → **Client Secret 코드 생성** → 활성화 상태 **사용함** → 코드 복사 (= Client Secret)

## 4. Supabase에 카카오 키 넣기
1. https://supabase.com/dashboard/project/<REF>/auth/providers → **Kakao** 펼치기 → **Enable** ON
2. **REST API Key(Client ID)**: 3-1의 REST API 키 / **Client Secret Code**: 3-2의 코드
3. 화면의 **Callback URL**이 2-2에 등록한 주소와 정확히 같은지 확인 → **Save**
4. (선택) “Allow users without an email”이 있으면 **ON** — 이메일 동의를 받지 않기 때문이에요

## 5. Supabase 주소 설정 (봇이 커넥터로 못 하면 직접)
https://supabase.com/dashboard/project/<REF>/auth/url-configuration
- **Site URL**: `https://simin-gwonryeok.netlify.app`
- **Redirect URLs**(추가): `https://simin-gwonryeok.netlify.app/**`  (로컬 테스트용: `http://localhost:3000/**`)

## 6. 확인
1. https://simin-gwonryeok.netlify.app → 우상단 **카카오로 시작** → 카카오 동의 화면(닉네임만) → 사이트로 돌아와 닉네임 표시
2. 카드 숙의 몇 장 → **내 참여**에서 기록 확인 → 다른 브라우저에서 로그인해도 같은 기록
3. **내 참여 → 탈퇴하고 기록 삭제** 동작 확인

## 참고: 봇이 하는 일 / 공개 키 원칙
- Netlify 환경변수: `NEXT_PUBLIC_SUPABASE_URL=https://<REF>.supabase.co`, `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=sb_publishable_…` (공개용 키만. service_role/secret 키는 절대 사용·노출하지 않음)
- 키가 없으면 사이트는 지금처럼 브라우저 저장(예시) 모드로 동작해요.

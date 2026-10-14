# 카카오 로그인 + Supabase 연결 가이드 (시민권력 OS)

> 현재 상태(2026.10.14): 백엔드는 기존 Supabase 프로젝트 **dialog-platform**(`bskczruswajwmmubsenf`) 안의 별도 스키마 `civic`에 연결돼 있어요(기존 dialog 데이터는 건드리지 않음). 사이트는 이미 이 프로젝트로 배포됐고, **카카오 제공자만 켜면** 실제 로그인이 됩니다. 지금은 카카오가 꺼져 있어 로그인 버튼을 누르면 "준비 중" 안내가 뜨고, 기록은 브라우저에만 저장돼요.

## 1. 카카오 개발자 앱 만들기
1. https://developers.kakao.com 로그인 → 상단 **내 애플리케이션** → **애플리케이션 추가하기**
2. 앱 이름: `시민권력 OS`, 회사명: 본인/단체명 → 저장
3. **앱 설정 > 플랫폼 > Web 플랫폼 등록** → 사이트 도메인: `https://simin-gwonryeok.netlify.app`

## 2. 카카오 로그인 켜기
1. **제품 설정 > 카카오 로그인** → 활성화 설정 **ON**
2. **Redirect URI 등록**:
   ```
   https://bskczruswajwmmubsenf.supabase.co/auth/v1/callback
   ```
   (카카오가 돌려보내는 곳은 우리 사이트가 아니라 Supabase예요. 정확히 위 주소 한 줄만)
3. **제품 설정 > 카카오 로그인 > 동의항목**
   - **닉네임(profile_nickname)**: 필수 동의 → 목적: “서비스 내 공개 별칭”
   - **프로필 사진(profile_image)**, **카카오계정(이메일)(account_email)**: **선택 동의**로 설정 → 목적: “로그인 처리(서비스 내 저장·표시 안 함)”
     - 이유: Supabase 카카오 연동이 이 두 항목을 항상 함께 요청해서, 설정하지 않으면 KOE205 오류로 로그인이 실패해요.
     - 이메일 항목은 **비즈 앱 전환**이 필요할 수 있어요(개인 개발자도 사업자번호 없이 가능).
     - 사용자가 동의하면 이메일·사진 주소가 Supabase 로그인 기록(dialog-platform과 공유)에 남을 수 있어요. 시민권력 테이블엔 닉네임만 저장하고 표시하지 않으며, 사용자는 거부할 수 있어요(`/privacy`에 안내됨).

## 3. 키 확인
1. **앱 설정 > 앱 키** → **REST API 키** 복사 (= Client ID)
2. **제품 설정 > 카카오 로그인 > 보안** → **Client Secret 코드 생성** → 활성화 상태 **사용함** → 코드 복사 (= Client Secret)

## 4. Supabase에 카카오 키 넣기
1. https://supabase.com/dashboard/project/bskczruswajwmmubsenf/auth/providers → **Kakao** 펼치기 → **Enable** ON
2. **REST API Key(Client ID)**: 3-1의 REST API 키 / **Client Secret Code**: 3-2의 코드
3. 화면의 **Callback URL**이 2-2에 등록한 주소와 정확히 같은지 확인 → **Save**
4. (선택) “Allow users without an email”이 있으면 **ON** — 이메일 동의를 받지 않기 때문이에요

## 5. Supabase 주소 설정 (직접 — 커넥터로는 변경 불가)
https://supabase.com/dashboard/project/bskczruswajwmmubsenf/auth/url-configuration
- **Site URL**: ⚠️ **바꾸지 마세요.** dialog-platform이 쓰는 기존 값을 그대로 둡니다(바꾸면 dialog 로그인/메일 링크가 깨짐).
- **Redirect URLs**(추가): `https://simin-gwonryeok.netlify.app/**`  ← 기존 항목은 지우지 말고 **추가만** 하세요. (로컬 테스트용: `http://localhost:3000/**`)
- 이 항목이 없으면 카카오 로그인 후 시민권력이 아니라 dialog의 Site URL로 돌아가요.

## 6. 확인
1. https://simin-gwonryeok.netlify.app → 우상단 **카카오로 시작** → 카카오 동의 화면(닉네임만) → 사이트로 돌아와 닉네임 표시
2. 카드 숙의 몇 장 → **내 참여**에서 기록 확인 → 다른 브라우저에서 로그인해도 같은 기록
3. **내 참여 → 탈퇴하고 기록 삭제** 동작 확인

## 참고: 봇이 하는 일 / 공개 키 원칙
- Netlify 환경변수: `NEXT_PUBLIC_SUPABASE_URL=https://bskczruswajwmmubsenf.supabase.co`, `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=sb_publishable_…` (공개용 키만. service_role/secret 키는 절대 사용·노출하지 않음)
- 키가 없으면 사이트는 지금처럼 브라우저 저장(예시) 모드로 동작해요.

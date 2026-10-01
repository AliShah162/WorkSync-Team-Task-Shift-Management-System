1. Install dependencies:
   ```bash
   npm install

2. Create .env.local:
NEXT_PUBLIC_API_URL=http://localhost:4000

3. Start 
npm run dev

Open http://localhost:3000.

----Build
npm run build
npm run start

----Pages
Path	          Type	       Notes
/	              Client	Protected home
/login	          Client	Login form
/register	      Client	Register form
/projects	      Client	List + create (admin)
/projects/[id]	  Client	Detail + member management
/tasks	          Client	List + create (admin) + filters + pagination
/tasks/[id]	      Client	Detail + status + comments
/shifts	          Client	Clock in/out + history
/dashboard	      Server	SSR — stats + recent activity


----Next.js API Routes
Path	                  Method	Purpose
/api/logger	              POST	    Structured frontend log storage
/api/machine-timezone	  GET	    Timezone, UTC offset, server timestamp


---State Management
Redux Toolkit (src/store/):
authSlice — user + token, persisted via localStorage

----Auth
* Token stored in localStorage + cookie (cookie used for SSR page)
* api axios instance automatically attaches Authorization: Bearer ...
* Response interceptor unwraps { success, data } to data

---Styling
Tailwind CSS. Global styles at src/app/globals.css.

Notes
* Backend must run on port 4000
* Backend response wrapper { success, data } is unwrapped in src/lib/api.ts

'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Login, Register } from '../api/fetchApi/admin';

export default function loginRegisterUser() {
    const router = useRouter();
    const [activeTab, setActiveTab] = useState("login");
    const [remember, setRemember] = useState(false);
    const [login, setLogin] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const [country, setCountry] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [day, setDay] = useState<string>('');
    const [month, setMonth] = useState<string>('');
    const [year, setYear] = useState<string>('');

    const handleLogin = async () => {
        setError('');
        if (!email || !password) { setError('Введіть email та пароль.'); return; }
        setLoading(true);
        await Login(email, password);
        router.push('/myAccount');
        setLoading(false);
    };

    const handleRegister = async () => {
        setError('');
        if (!login || !password || !email || !country || !name || !day || !month || !year) {
            setError('Введіть значення.');
            return;
        }
        setLoading(true);
        try {
            const dob = new Date(`${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`).toISOString();
            const result = await Register(login, password, name, email, country, dob);
            if (!result.ok) { setError(result.message || 'Помилка реєстрації.'); return; }
            router.push('/myAccount');
        } catch (err) {
            setError('Не вдалось підключитись до сервера.');
        } finally {
            setLoading(false);
        }
    };

    const currentImage = activeTab === "login"
        ? "/images/userAccount/firstImageInCreateAccountScreen.png"
        : "/images/userAccount/secondImageForCreateAccountScreen.png";

    const inputClass = "input bg-[#F9F9F9] w-full h-[45px] sm:h-[50px] rounded-[3px] px-3";

    return (
        <div className="relative lg:flex bg-white min-h-screen sm:p-[45px]">
            {/* Фон-картинка тільки на мобільному/планшеті */}
            <div
                className="absolute inset-0 lg:hidden bg-cover bg-center"
                style={{ backgroundImage: `url('${currentImage}')` }}
            >
                <div className="absolute inset-0 bg-black/50" />
            </div>

            {/* Картинка збоку — тільки десктоп */}
            <div className="hidden lg:block mt-4">
                <img src={currentImage} alt="preview" className="w-full h-auto max-w-[859px]" />
            </div>

            {/* Форма */}
            <div className="relative z-10 pt-10 sm:pt-16 lg:pt-[200px] pb-10 px-5 sm:px-8 lg:pl-[60px] lg:pr-8 w-full max-w-xl mx-auto lg:mx-0">
                <div className="bg-white/40 backdrop-blur-sm lg:bg-transparent lg:backdrop-blur-none rounded-xl lg:rounded-none p-5 sm:p-6 lg:p-0">
                    <h1 className="text-3xl sm:text-4xl lg:text-5xl pb-4 lg:pb-[20px]">Your profile</h1>

                    <div className="flex border-b">
                        <button
                            onClick={() => setActiveTab("login")}
                            className={`flex-1 pb-2 text-sm sm:text-base ${activeTab === "login" ? "border-b-2 border-black text-black" : "text-gray-400"}`}
                        >
                            I am already a user
                        </button>
                        <button
                            onClick={() => setActiveTab("register")}
                            className={`flex-1 pb-2 text-sm sm:text-base ${activeTab === "register" ? "border-b-2 border-black text-black" : "text-gray-400"}`}
                        >
                            Create an account
                        </button>
                    </div>

                    <button className="mt-4">
                        <img src="/images/userAccount/LogWithGoogleImgforBtn.png" alt="" className="w-full max-w-[290px] h-auto" />
                    </button>
                    <h4 className="my-2">Or</h4>

                    <div className="mt-4">
                        {activeTab === "login" ? (
                            <div className="flex flex-col gap-3">
                                <div>
                                    <p className="mb-1 text-sm">Email</p>
                                    <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className={inputClass} />
                                </div>
                                <div>
                                    <p className="mb-1 text-sm">Password</p>
                                    <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className={inputClass} />
                                </div>
                            </div>
                        ) : (
                            <div className="flex flex-col gap-3">
                                <div>
                                    <p className="mb-1 text-sm">Login</p>
                                    <input type="text" value={login} onChange={(e) => setLogin(e.target.value)} className={inputClass} />
                                </div>
                                <div>
                                    <p className="mb-1 text-sm">Email</p>
                                    <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className={inputClass} />
                                </div>
                                <div>
                                    <p className="mb-1 text-sm">Your name</p>
                                    <input type="text" value={name} onChange={(e) => setName(e.target.value)} className={inputClass} />
                                </div>
                                <div className="flex gap-2 items-end flex-wrap">
                                    <div className="flex flex-col flex-1 min-w-[90px]">
                                        <p className="mb-1 text-sm">Birth day</p>
                                        <input type="number" min={1} max={31} placeholder="DD" value={day} onChange={(e) => setDay(e.target.value)} className="bg-[#F9F9F9] w-full h-[45px] sm:h-[50px] rounded-[3px] px-2" />
                                    </div>
                                    <div className="flex flex-col flex-1 min-w-[90px]">
                                        <p className="mb-1 text-sm">Month</p>
                                        <input type="number" min={1} max={12} placeholder="MM" value={month} onChange={(e) => setMonth(e.target.value)} className="bg-[#F9F9F9] w-full h-[45px] sm:h-[50px] rounded-[3px] px-2" />
                                    </div>
                                    <div className="flex flex-col flex-1 min-w-[90px]">
                                        <p className="mb-1 text-sm">Year</p>
                                        <input type="number" min={1900} max={2025} placeholder="YYYY" value={year} onChange={(e) => setYear(e.target.value)} className="bg-[#F9F9F9] w-full h-[45px] sm:h-[50px] rounded-[3px] px-2" />
                                    </div>
                                </div>
                                <div>
                                    <p className="mb-1 text-sm">Country</p>
                                    <input type="text" value={country} onChange={(e) => setCountry(e.target.value)} className={inputClass} />
                                </div>
                                <div>
                                    <p className="mb-1 text-sm">Password</p>
                                    <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className={inputClass} />
                                </div>
                            </div>
                        )}

                        {activeTab === "login" && (
                            <p className="text-sm my-4 cursor-pointer hover:underline">Forgot a password?</p>
                        )}

                        <div className="flex items-center gap-3 my-4 sm:my-6">
                            <input type="checkbox" id="remember" checked={remember} onChange={() => setRemember(!remember)} className="w-5 h-5 shrink-0" />
                            <label htmlFor="remember" className="text-sm">
                                {activeTab === "login" ? "Remember me" : "Let me know about new in"}
                            </label>
                        </div>

                        {error && <p className="text-red-500 text-sm mb-3">{error}</p>}

                        <button
                            onClick={activeTab === "login" ? handleLogin : handleRegister}
                            disabled={loading}
                            className="w-full bg-zinc-800 text-white py-3 sm:py-4 text-base sm:text-lg tracking-widest hover:bg-zinc-700 transition-colors disabled:opacity-50"
                        >
                            {activeTab == "login" ? (loading ? 'Завантаження...' : 'Log in') : (loading ? 'Завантаження...' : 'Sing up')}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
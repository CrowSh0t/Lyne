'use client';
import Image from 'next/image';
import { useState } from 'react';
import { useRouter } from 'next/navigation';


export default function loginRegisterUser() {
    const [activeTab, setActiveTab] = useState("login"); // змінна для перевірки яка із вкладок вибрана

    const [remember, setRemember] = useState(false);

    const [login, setLogin] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const [country, setCountry] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [day, setDay] = useState('');
    const [month, setMonth] = useState('');
    const [year, setYear] = useState('');
    const router = useRouter();

    // Для логіну
    const handleLogin = async () => {
        setError('');

        if (!email || !password) {
            setError('Введіть email та пароль.');
            return;
        }

        setLoading(true);

        try {
            const res = await fetch('/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({ login: email, password: password }),
            });

            const data = await res.json();

            if (!res.ok) {
                setError(data.message || 'Помилка входу.');
                return;
            }
            // Отримуємо ім'я і зберігаємо
            const meRes = await fetch('/api/me', { credentials: 'include' });
            const meData = await meRes.json();
            localStorage.setItem('username', meData.name || '');

            router.push('/myAccount');
        } catch (err) {
            setError('Не вдалось підключитись до сервера.');
        } finally {
            setLoading(false);
        }
    };

    // Для реєстрації
    const handleRegister = async () => {
        setError('');
        if (!login || !password || !email || !country || !name || !day || !month || !year) {
            setError('Введіть значення.');
            return;
        }
        setLoading(true);
        try {
            const dob = new Date(`${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`).toISOString();

            const res = await fetch('/api/auth/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({ login, password, name, email, country, dob }),
            });
            const data = await res.json();
            console.log("STATUS:", res.status);
            console.log("RESPONSE:", data);
            console.log(login, email, country, name);

            if (!res.ok) {
                setError(data.message || 'Помилка реєстрації.');
                return;
            }
            const meRes = await fetch('/api/me', { credentials: 'include' });
            const meData = await meRes.json();
            localStorage.setItem('username', meData.name || '');

            router.push('/myAccount');
        } catch (err) {
            setError('Не вдалось підключитись до сервера.');
        } finally {
            setLoading(false);
        }

    };

    return (
        <div className="flex bg-white">
            <div className="mt-4">
                <Image src={activeTab === "login" ? "/images/firstImageInCreateAccountScreen.png" : "/images/secondImageForCreateAccountScreen.png"}
                    alt="preview" width={859} height={1086}
                />
            </div>

            <div className="pt-[200px] pl-[60px]">
                <h1 className="text-5xl pb-[20px]" >Your profile</h1>

                <div className="flex border-b">
                    <button
                        onClick={() => setActiveTab("login")}
                        className={`flex-1 pb-2 ${activeTab === "login"
                            ? "border-b-2 border-black text-black"
                            : "text-gray-400"
                            }`}
                    >
                        I am already a user
                    </button>

                    <button
                        onClick={() => setActiveTab("register")}
                        className={`flex-1 pb-2 ${activeTab === "register"
                            ? "border-b-2 border-black text-black"
                            : "text-gray-400"
                            }`}
                    >
                        Create an account
                    </button>
                </div>
                <button>
                    <Image src="/images/LogWithGoogleImgforBtn.png" alt="" width={290} height={49} />
                </button>
                <h4>Or</h4>
                <div className="mt-4">
                    {activeTab === "login" ? (
                        <div >

                            <p>Email</p>
                            <input type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)} className="input bg-[#F9F9F9] w-[701] h-[50] br-[3]" />
                            <p>Password</p>
                            <input type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)} className="input bg-[#F9F9F9] w-[701] h-[50] br-[3]" />
                        </div>
                    ) : (
                        <div>
                            <p>Login</p>
                            <input type="text"
                                value={login}
                                onChange={(e) => setLogin(e.target.value)}
                                className="input bg-[#F9F9F9] w-[701] h-[50] br-[3]"
                            />
                            <p>Email</p>
                            <input type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)} className="input bg-[#F9F9F9] w-[701] h-[50] br-[3]" />
                            <p>Your name</p>
                            <input type="name"
                                value={name}
                                onChange={(e) => setName(e.target.value)} className="input bg-[#F9F9F9] w-[701] h-[50] br-[3]" />
                            <div className="flex gap-2 items-center">
                                <div className='className="flex flex-col'>
                                    <p>Birth day</p>
                                    <input
                                        type="number"
                                        min={1} max={31}
                                        placeholder="DD"
                                        value={day}
                                        onChange={(e) => setDay(e.target.value)}
                                        className="bg-[#F9F9F9] w-[184px] h-[50px] rounded-[3px] px-2"
                                    />
                                </div>
                                <div className='className="flex flex-col'>
                                    <p>Mounth</p>
                                    <input
                                        type="number"
                                        min={1} max={12}
                                        placeholder="MM"
                                        value={month}
                                        onChange={(e) => setMonth(e.target.value)}
                                        className="bg-[#F9F9F9] w-[184px] h-[50px] rounded-[3px] px-2"
                                    />
                                </div>
                                <div className='className="flex flex-col'>
                                    <p>Year</p>
                                    <input
                                        type="number"
                                        min={1900} max={2025}
                                        placeholder="YYYY"
                                        value={year}
                                        onChange={(e) => setYear(e.target.value)}
                                        className="bg-[#F9F9F9] w-[184px] h-[50px] rounded-[3px] px-2"
                                    />
                                </div>
                            </div>

                            <p>Country</p>
                            <input type="country"
                                value={country}
                                onChange={(e) => setCountry(e.target.value)} className="input bg-[#F9F9F9] w-[701] h-[50] br-[3]" />
                            <p>Password</p>
                            <input type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)} className="input bg-[#F9F9F9] w-[701] h-[50] br-[3]" />
                        </div>
                    )}

                    {/* Forgot password */}
                    {activeTab === "login" && (
                        <p className="text-sm mb-4 cursor-pointer hover:underline">
                            Forgot a password?
                        </p>
                    )}

                    {/* Remember me */}
                    <div className="flex items-center gap-3 mb-6">
                        <input
                            type="checkbox"
                            id="remember"
                            checked={remember}
                            onChange={() => setRemember(!remember)}
                            className="w-5 h-5"
                        />
                        <label htmlFor="remember" className="text-sm">
                            {activeTab === "login" ? "Remember me" : "Let me know about new in"}
                        </label>
                    </div>
                    {/* Кнопка */}
                    <button
                        onClick={activeTab === "login" ? handleLogin : handleRegister}
                        disabled={loading}
                        className="w-full bg-zinc-800 text-white py-4 text-lg tracking-widest hover:bg-zinc-700 transition-colors disabled:opacity-50"
                    >
                        {activeTab == "login" ? loading ? 'Завантаження...' : 'Log in' : loading ? 'Завантаження...' : 'Sing up'}
                    </button>
                </div>
            </div>
        </div>
    );
}
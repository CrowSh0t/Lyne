'use client';
import Image from 'next/image';
import { useState } from 'react';
import { useRouter } from 'next/navigation';


export default function accountPage() {
    const [activeTab, setActiveTab] = useState("login");

    const [remember, setRemember] = useState(false);

    const [login, setLogin] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const [country, setCountry] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const router = useRouter();

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
            router.push('/adminMainPage');
        } catch (err) {
            setError('Не вдалось підключитись до сервера.');
        } finally {
            setLoading(false);
        }
    };

    const handleRegister = async () => {
        setError('')
        if (!login || !password || !email || !country || !name) {
            setError('Введіть значення.');
            return;
        }
        setLoading(true);
        try {
            const res = await fetch('/api/auth/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({ login: login, password: password, name: name, email: email, country: country }),
            });

            const data = await res.json();
            console.log("STATUS:", res.status);
            console.log("RESPONSE:", data);
            console.log(login, email,country,name);

            if (!res.ok) {
                setError(data.message || 'Помилка реєстрації.');
                return;
            }
            router.push('/');
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
                            <p>Email</p>
                            <input type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)} className="input bg-[#F9F9F9] w-[701] h-[50] br-[3]" />
                            <p>Your name</p>
                            <input type="name"
                                value={name}
                                onChange={(e) => setName(e.target.value)} className="input bg-[#F9F9F9] w-[701] h-[50] br-[3]" />
                            {/* <div>
                                <p>Birthday day</p>
                                <input className="input bg-[#F9F9F9] w-[701] h-[50] br-[3]" />
                                <p>mounth</p>
                                <input placeholder="" className="input bg-[#F9F9F9] w-[701] h-[50] br-[3]" />
                                <p>year</p>
                                <input placeholder="" className="input bg-[#F9F9F9] w-[701] h-[50] br-[3]" />
                            </div> */}
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
                    <p className="text-sm mb-4 cursor-pointer hover:underline">
                        Forgot a password?
                    </p>

                    {/* Remember me */}
                    <div className="flex items-center gap-3 mb-6">
                        <input
                            type="checkbox"
                            id="remember"
                            checked={remember}
                            onChange={() => setRemember(!remember)}
                            className="w-5 h-5"
                        />
                        <label htmlFor="remember" className="text-sm">Remember me</label>
                    </div>
                    {/* Кнопка */}
                    <button
                        onClick={activeTab === "login" ? handleLogin : handleRegister}
                        disabled={loading}
                        className="w-full bg-zinc-800 text-white py-4 text-lg tracking-widest hover:bg-zinc-700 transition-colors disabled:opacity-50"
                    >
                        {activeTab== "login" ? loading ? 'Завантаження...' : 'Log in' : loading ? 'Завантаження...' : 'Sing up' }
                    </button>
                </div>
            </div>
        </div>
    );
}
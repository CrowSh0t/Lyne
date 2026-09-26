'use client';
import { useEffect, useState } from 'react';

interface InquiryDto {
    id: number;
    name: string;
    email: string;
    phone: string;
    text: string;
    status: number | string;
    createdAt: string;
}

export default function AdminInquiriesPage() {
    const [inquiries, setInquiries] = useState<InquiryDto[]>([]);
    const [loading, setLoading] = useState(true);
    const [errorMsg, setErrorMsg] = useState<string | null>(null);

    // Допоміжна функція для пошуку токена
    const getToken = () => {
        const getCookie = (name: string) => {
            const value = `; ${document.cookie}`;
            const parts = value.split(`; ${name}=`);
            if (parts.length === 2) return parts.pop()?.split(';').shift();
            return null;
        };
        return localStorage.getItem('token') || sessionStorage.getItem('token') || getCookie('token');
    };

    useEffect(() => {
        const fetchInquiries = async () => {
            try {
                const token = getToken();
                if (!token) {
                    setErrorMsg("Токен авторизації не знайдено. Спробуйте перелогінитись в адмінку.");
                    setLoading(false);
                    return;
                }

                const res = await fetch('http://localhost:5097/api/Inquiries/admin/all', {
                    headers: { 'Authorization': `Bearer ${token}` }
                });

                if (res.ok) {
                    const data = await res.json();
                    setInquiries(data);
                } else {
                    setErrorMsg(`Помилка сервера: ${res.status} ${res.statusText}`);
                }
            } catch (error) {
                setErrorMsg(`Помилка з'єднання з сервером: ${error}`);
            } finally {
                setLoading(false);
            }
        };

        fetchInquiries();
    }, []);

    // === НОВА ФУНКЦІЯ: Зміна статусу ===
    const handleStatusChange = async (id: number, newStatusVal: number) => {
        try {
            const token = getToken();
            
            // 1. Метод змінено на PATCH (згідно з твоїм [HttpPatch])
            const res = await fetch(`http://localhost:5097/api/Inquiries/admin/${id}/status`, {
                method: 'PATCH', 
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                // 2. Відправляємо об'єкт DTO. 
                // УВАГА: Якщо в твоєму UpdateInquiryStatusDto поле називається якось інакше (наприклад, NewStatus), 
                // то зміни слово "status" нижче на відповідне.
                body: JSON.stringify({ status: newStatusVal }) 
            });

            if (res.ok) {
                setInquiries(prev => 
                    prev.map(inq => 
                        inq.id === id ? { ...inq, status: newStatusVal } : inq
                    )
                );
            } else {
                alert(`Не вдалося оновити статус. Код помилки: ${res.status}`);
            }
        } catch (error) {
            console.error('Помилка оновлення статусу:', error);
            alert("Помилка з'єднання при оновленні статусу.");
        }
    };

    if (loading) return <div className="p-8 text-xl">Loading inquiries...</div>;
    if (errorMsg) return (
        <div className="p-8 w-full">
            <h1 className="text-3xl font-bold mb-6">Support Inquiries</h1>
            <div className="p-4 bg-red-100 text-red-700 rounded-md">{errorMsg}</div>
        </div>
    );

    return (
        <div className="p-8 w-full">
            <h1 className="text-3xl font-bold mb-6">Support Inquiries</h1>
            
            <div className="bg-white rounded-lg shadow overflow-hidden">
                <table className="min-w-full border-collapse">
                    <thead className="bg-gray-100 border-b-2 border-gray-200">
                        <tr>
                            <th className="p-4 text-left font-semibold text-gray-700">ID</th>
                            <th className="p-4 text-left font-semibold text-gray-700">Date</th>
                            <th className="p-4 text-left font-semibold text-gray-700">Name</th>
                            <th className="p-4 text-left font-semibold text-gray-700">Contacts</th>
                            <th className="p-4 text-left font-semibold text-gray-700 w-1/3">Message</th>
                            <th className="p-4 text-left font-semibold text-gray-700">Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {inquiries.length === 0 ? (
                            <tr>
                                <td colSpan={6} className="p-4 text-center text-gray-500">
                                    No inquiries found.
                                </td>
                            </tr>
                        ) : (
                            inquiries.map((inq) => {
                                // Визначаємо числове значення статусу для правильної прив'язки select
                                const currentStatusVal = 
                                    (inq.status === 'New' || inq.status === 0) ? 0 :
                                    (inq.status === 'InProgress' || inq.status === 1) ? 1 : 2;

                                return (
                                    <tr key={inq.id} className="border-b hover:bg-gray-50 transition-colors">
                                        <td className="p-4 text-gray-600">#{inq.id}</td>
                                        <td className="p-4 text-gray-600">
                                            {new Date(inq.createdAt).toLocaleDateString('uk-UA')}
                                        </td>
                                        <td className="p-4 font-medium">{inq.name}</td>
                                        <td className="p-4 text-sm">
                                            <div>{inq.email}</div>
                                            <div className="text-gray-500">{inq.phone}</div>
                                        </td>
                                        <td className="p-4 text-gray-600 text-sm">
                                            {inq.text}
                                        </td>
                                        <td className="p-4">
                                            {/* Випадаючий список для зміни статусу */}
                                            <select 
                                                value={currentStatusVal}
                                                onChange={(e) => handleStatusChange(inq.id, Number(e.target.value))}
                                                className={`border rounded-md p-2 text-sm font-medium cursor-pointer outline-none transition-colors
                                                    ${currentStatusVal === 0 ? 'bg-blue-50 text-blue-700 border-blue-200' : 
                                                      currentStatusVal === 1 ? 'bg-yellow-50 text-yellow-700 border-yellow-200' : 
                                                      'bg-green-50 text-green-700 border-green-200'}`}
                                            >
                                                <option value={0}>New</option>
                                                <option value={1}>In Progress</option>
                                                <option value={2}>Resolved</option>
                                            </select>
                                        </td>
                                    </tr>
                                );
                            })
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
import { useEffect, useState } from "react"
import {
    Card, CardContent, CardHeader, CardTitle
} from "@/components/ui/card"
import {
    MessageSquare, Sprout, DollarSign, TrendingUp
} from "lucide-react"

export default function KpiCards() {
    const [contacts, setContacts] = useState(null)
    const [contactsLastMonth, setContactsLastMonth] = useState(null)

    const [visits, setVisits] = useState(null)
    const [visitsLastMonth, setVisitsLastMonth] = useState(null)

    // =============================
    // tính lượt liên hệ trong tháng
    // =============================
    useEffect(() => {
        const fetchContacts = async () => {
            try {
                const url = `${import.meta.env.VITE_MAIN_BE_URL}/api/lienhe/month/total`
                const urlLastMonth = `${import.meta.env.VITE_MAIN_BE_URL}/api/lienhe/before-current-month/total`

                const [res, resLast] = await Promise.all([fetch(url), fetch(urlLastMonth)])
                const data = await res.json()
                const dataLast = await resLast.json()

                setContacts(data.total)
                setContactsLastMonth(dataLast.total)

                console.log(data.tatal, dataLast.total);
            } catch (err) {
                console.error("Lỗi khi fetch liên hệ:", err)
            }
        }
        fetchContacts()
    }, [])

    let contactsChange = "N/A"
    if (contacts !== null && contactsLastMonth !== null) {
        if (contactsLastMonth === 0) {
            if (contacts === 0) {
                contactsChange = "0%"
            } else {
                contactsChange = `tăng +${contacts} lượt`
            }
        } else {
            const percent = ((contacts - contactsLastMonth) / contactsLastMonth) * 100
            contactsChange = `${percent > 0 ? "+" : ""}${percent.toFixed(1)}%`
        }
    }

    // =============================
    // tính lượt truy cập trong tháng
    // =============================
    useEffect(() => {
        const fetchVisits = async () => {
            try {
                const url = `${import.meta.env.VITE_MAIN_BE_URL}/api/site/visits/month/total`
                const urlLastMonth = `${import.meta.env.VITE_MAIN_BE_URL}/api/site/visits/before-current-month/total`

                const [res, resLast] = await Promise.all([fetch(url), fetch(urlLastMonth)])
                const data = await res.json()
                const dataLast = await resLast.json()

                setVisits(data.total)
                setVisitsLastMonth(dataLast.total)
            } catch (err) {
                console.error("Lỗi khi fetch visits:", err)
            }
        }
        fetchVisits()
    }, [])

    let visitsChange = "N/A"
    if (visits !== null && visitsLastMonth !== null) {
        if (visitsLastMonth === 0) {
            if (visits === 0) {
                visitsChange = "0%"
            } else {
                visitsChange = `tăng +${visits} lượt`
            }
        } else {
            const percent = ((visits - visitsLastMonth) / visitsLastMonth) * 100
            visitsChange = `${percent > 0 ? "+" : ""}${percent.toFixed(1)}%`
        }
    }

    const cards = [
        {
            title: "Liên hệ tháng này",
            value: contacts !== null ? contacts : "...",
            change: contactsChange,
            icon: MessageSquare
        },
        { title: "Đơn đặt website tháng này", value: 8, change: "+25%", icon: Sprout },
        { title: "Doanh thu tháng này", value: "98.5M", change: "+18%", icon: DollarSign },
        {
            title: "Lượt khách truy cập tháng này",
            value: visits !== null ? visits : "...",
            change: visitsChange,
            icon: TrendingUp
        },
    ]






    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {cards.map(({ title, value, change, icon: Icon }, i) => (
                <Card
                    key={i}
                    className="bg-white admin-dark:bg-gray-800 border border-gray-200 admin-dark:border-gray-700 shadow-sm"
                >
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-gray-800 admin-dark:text-gray-100">{title}</CardTitle>
                        <Icon className="h-4 w-4 text-gray-500 admin-dark:text-gray-400" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-gray-800 admin-dark:text-gray-100">{value}</div>
                        <p className="text-xs text-gray-500 admin-dark:text-gray-400">
                            <span className={change.startsWith("-") ? "text-red-600 admin-dark:text-red-400" : "text-green-600 admin-dark:text-green-400"}>
                                {change} so với tháng trước
                            </span>
                        </p>
                    </CardContent>
                </Card>
            ))}
        </div>
    )
}

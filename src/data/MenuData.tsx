
interface MenuItem {
    id: number;
    title: string;
    link: string;
    has_dropdown: boolean;
    sub_menus?: {
        link: string;
        title: string;
    }[];
}

const menu_data: MenuItem[] = [
    {
        id: 1,
        title: "Home",
        link: "/",
        has_dropdown: false
    },
    {
        id: 2,
        title: "Airport Parking",
        link: "/hotel-grid",
        has_dropdown: true,
        sub_menus: [
            { link: "/hotel-grid?airport=heathrow", title: "Heathrow" },
            { link: "/hotel-grid?airport=gatwick", title: "Gatwick" },
            { link: "/hotel-grid?airport=manchester", title: "Manchester" },
            { link: "/hotel-grid?airport=stansted", title: "Stansted" },
            { link: "/hotel-grid?airport=luton", title: "Luton" },
            { link: "/hotel-grid?airport=cardiff", title: "Cardiff" },
            { link: "/hotel-grid?airport=bristol", title: "Bristol" },
            { link: "/hotel-grid?airport=exeter", title: "Exeter" },
            { link: "/hotel-grid?airport=liverpool", title: "Liverpool" },
            { link: "/hotel-grid?airport=southend", title: "Southend" }
        ],
    },
    {
        id: 3,
        title: "About Us",
        link: "/about",
        has_dropdown: false
    },
    {
        id: 4,
        title: "Faq",
        link: "/faq",
        has_dropdown: false
    },
    {
        id: 5,
        title: "Blogs",
        link: "/blog-grid",
        has_dropdown: false
    },
    {
        id: 6,
        has_dropdown: false,
        title: "Contact",
        link: "/contact",
    },
];

export default menu_data;
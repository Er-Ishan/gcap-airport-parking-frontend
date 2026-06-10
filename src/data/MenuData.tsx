
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
        link: "#",
        has_dropdown: true,
        sub_menus: [
            { link: "/airport-parking?airport=heathrow", title: "Heathrow" },
            { link: "/airport-parking?airport=gatwick", title: "Gatwick" },
            { link: "/airport-parking?airport=manchester", title: "Manchester" },
            { link: "/airport-parking?airport=stansted", title: "Stansted" },
            { link: "/airport-parking?airport=luton", title: "Luton" },
            { link: "/airport-parking?airport=cardiff", title: "Cardiff" },
            { link: "/airport-parking?airport=bristol", title: "Bristol" },
            { link: "/airport-parking?airport=exeter", title: "Exeter" },
            { link: "/airport-parking?airport=liverpool", title: "Liverpool" },
            { link: "/airport-parking?airport=southend", title: "Southend" }
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
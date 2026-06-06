
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
        link: "#",
        has_dropdown: false
    },
    {
        id: 2,
        title: "Airport Parking",
        link: "#",
        has_dropdown: true,
        sub_menus: [
            { link: "#", title: "Heathrow" },
            { link: "#", title: "Gatwick" },
            { link: "#", title: "Manchester" },
            { link: "#", title: "Stansted" },
            { link: "#", title: "Luton" },
            { link: "#", title: "Cardiff" },
            { link: "#", title: "Bristol" },
            { link: "#", title: "Exter" },
            { link: "#", title: "Liverpool" },
            { link: "#", title: "Southend" }
        ],
    },
    {
        id: 3,
        title: "About Us",
        link: "#",
        has_dropdown: false
    },
    {
        id: 4,
        title: "Faq",
        link: "#",
        has_dropdown: false
    },
    {
        id: 5,
        title: "Blogs",
        link: "#",
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
import React from "react";
import { Link } from "react-router-dom";
import { Navbar, Typography, Button, Menu, MenuHandler, MenuList, MenuItem, Avatar } from "@material-tailwind/react";
import { UserCircleIcon, ChevronDownIcon, PowerIcon } from "@heroicons/react/24/solid";
import { DefaultAvatar as Logo } from "../../assets/images";
import { useAppDispatch, useAppSelector } from "../../hooks/hooks";
import { authActions } from "../../redux/slices";

// profile menu component
const profileMenuItems = [
    {
        label: "My Profile",
        link: "/admin/profile",
        icon: UserCircleIcon,
    },
    {
        label: "Log Out",
        icon: PowerIcon,
    },
];

function ProfileMenu() {
    const avatar = useAppSelector((state) => state.authSlice.user.url_avatar);
    const dispatch = useAppDispatch();
    const [isMenuOpen, setIsMenuOpen] = React.useState(false);

    const closeMenu = () => setIsMenuOpen(false);
    const logout = () => {
        dispatch(authActions.logout());
    };

    return (
        <Menu open={isMenuOpen} handler={setIsMenuOpen} placement="bottom-end">
            <MenuHandler>
                <Button
                    variant="text"
                    color="blue-gray"
                    className="flex items-center gap-2 px-2 rounded-full py-0.5 lg:ml-auto"
                >
                    <Typography color="black"> Nhân nguyễn </Typography>
                    <Avatar
                        size="md"
                        alt="tania andrew"
                        withBorder={true}
                        className="border border-gray-400 p-0.5"
                        src={avatar ? avatar : Logo}
                    />
                    <ChevronDownIcon
                        strokeWidth={2.5}
                        color="black"
                        className={`h-3 w-3 transition-transform ${isMenuOpen ? "rotate-180" : ""}`}
                    />
                </Button>
            </MenuHandler>
            <MenuList className="p-2 gap-2">
                {profileMenuItems.map(({ label, icon, link }, key) => {
                    const isLastItem = key === profileMenuItems.length - 1;
                    return (
                        <Link to={link as string}>
                            <MenuItem
                                key={label}
                                onClick={isLastItem ? closeMenu : logout}
                                className={`flex items-center gap-2 rounded ${
                                    isLastItem
                                        ? "hover:bg-red-500 hover:text-white text-red"
                                        : "hover:bg-lightblue/80 hover:text-white "
                                }`}
                            >
                                {React.createElement(icon, {
                                    className: `h-4 w-4 `,
                                    strokeWidth: 2,
                                })}
                                <Typography
                                    as="span"
                                    variant="lead"
                                    className="font-normal"
                                    color={isLastItem ? "inherit" : "inherit"}
                                >
                                    {label}
                                </Typography>
                            </MenuItem>
                        </Link>
                    );
                })}
            </MenuList>
        </Menu>
    );
}

export function AdminNavbar() {
    return (
        <Navbar className="mx-auto my-2 max-w-screen-xl bg-gray-300 p-2 lg:rounded-full lg:pl-6">
            <div className="relative mx-auto flex items-center justify-between text-blue-gray-900">
                <Typography as="a" href="#" className="mr-4 ml-2 text-black cursor-pointer py-1.5 font-medium">
                    Utemy
                </Typography>

                <ProfileMenu />
            </div>
        </Navbar>
    );
}

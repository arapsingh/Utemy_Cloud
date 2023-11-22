import React, { useState, useRef, useEffect } from "react";
import {
    Card,
    CardHeader,
    CardBody,
    Typography,
    Avatar,
    Menu,
    MenuHandler,
    MenuList,
    MenuItem,
    Button,
} from "@material-tailwind/react";
import { DefaultAvatar as Logo } from "../../../assets/images";
import { Pagination } from "../../../components";
import SearchIcon from "../../../assets/icons/SeacrchIcon";
import { useAppDispatch, useAppSelector } from "../../../hooks/hooks";
import { userActions } from "../../../redux/slices";
import { DeleteModal } from "../../../components";
import { User } from "../../../types/user";
import toast, { Toaster } from "react-hot-toast";

const UserAdmin = () => {
    const [isOpenDeleteModal, setIsOpenDeleteModal] = useState(false);
    const [userId, setUserId] = useState(0);
    const dispatch = useAppDispatch();
    const currentId = useAppSelector((state) => state.authSlice.user.user_id);
    const users = useAppSelector((state) => state.userSlice.users);
    const totalPage = useAppSelector((state) => state.userSlice.totalPage);
    // const totalRecord = useAppSelector((state) => state.userSlice.totalRecord);
    const [userInput, setUserInput] = useState<string>("");
    const [searchItem, setSearchItem] = useState("");
    const [role, setRole] = useState("All");
    const [pageIndex, setPageIndex] = useState(1);
    const inputRef = useRef<HTMLInputElement>(null);
    const handleCancelDeleteModal = () => {
        setIsOpenDeleteModal(false);
    };
    const handleOpenDeleteModal = (id: number) => {
        setUserId(id);
        setIsOpenDeleteModal(false);
    };
    const handleDelete = () => {
        dispatch(userActions.deleteUser(userId)).then((response) => {
            if (response.payload?.status_code === 200) toast.success(response.payload.message);
            else if (response.payload) toast.error(response.payload.message);
        });
    };

    const handleReset = () => {
        setPageIndex(1);
        setSearchItem("");
        setRole("All");
    };
    const handleChangePageIndex = (pageIndex: number) => {
        if (pageIndex < 1) {
            setPageIndex(totalPage);
        } else if (pageIndex > totalPage) setPageIndex(1);
        else {
            setPageIndex(pageIndex);
        }
        return;
    };
    const handleKeyWordSearch = () => {
        if (inputRef.current) {
            inputRef.current.focus();
        }
        setSearchItem(userInput);
        setUserInput("");
    };
    useEffect(() => {
        dispatch(userActions.getAllUsersWithPagination({ pageIndex, searchItem, role }));
    }, [dispatch, pageIndex, searchItem, role]);
    return (
        <>
            {isOpenDeleteModal && <DeleteModal handleCancel={handleCancelDeleteModal} handleDelete={handleDelete} />}
            <div className="mt-12 mb-8 flex flex-col gap-12 bg-background_2 min-h-screen">
                <Toaster />
                <Card>
                    <CardHeader
                        variant="gradient"
                        color="gray"
                        className="mb-8 p-6 flex justify-center w-full self-center"
                    >
                        <div className="flex items-center text-start w-full">
                            <Menu>
                                <MenuHandler>
                                    <Button className="bg-black w-[90px] text-center">{role}</Button>
                                </MenuHandler>
                                <MenuList>
                                    <MenuItem
                                        id="All"
                                        className="text-black hover:bg-gray-400"
                                        onClick={() => setRole("All")}
                                    >
                                        All
                                    </MenuItem>
                                    <MenuItem
                                        id="Admin"
                                        className="text-black  hover:bg-gray-400"
                                        onClick={() => setRole("Admin")}
                                    >
                                        Admin
                                    </MenuItem>
                                    <MenuItem
                                        id="User"
                                        className="text-black  hover:bg-gray-400"
                                        onClick={() => setRole("User")}
                                    >
                                        User
                                    </MenuItem>
                                </MenuList>
                            </Menu>
                            <div className="w-3/4 mr-auto ml-3">
                                <div className="relative">
                                    <input
                                        ref={inputRef}
                                        type="text"
                                        placeholder="Search user..."
                                        className="rounded py-4 px-10 w-full border-[1px] text-gray-700 border-black"
                                        value={userInput}
                                        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                                            setUserInput(e.target.value)
                                        }
                                        onKeyDown={(e) => {
                                            if (e.key === "Enter") handleKeyWordSearch();
                                        }}
                                    />
                                    <div className="cursor-pointer" onClick={handleKeyWordSearch}>
                                        <SearchIcon />
                                    </div>
                                </div>
                            </div>
                            <div className="gap-2">
                                <button
                                    onClick={() => handleKeyWordSearch()}
                                    className="text-xl btn btn-info text-white hover:bg-lightblue/80 font-w "
                                >
                                    Search
                                </button>{" "}
                                <button onClick={() => handleReset()} className="text-xl btn btn-outline font-w ">
                                    Reset
                                </button>{" "}
                            </div>
                        </div>
                    </CardHeader>

                    <CardBody className="overflow-x-scroll px-0 pt-0 pb-2">
                        <table className="w-full min-w-[640px] table-auto">
                            <thead>
                                <tr>
                                    {["User", "Role", "Status", "Created at", "Actions"].map((el) => (
                                        <th key={el} className="border-b border-blue-gray-50 py-3 px-5 text-left">
                                            <Typography
                                                variant="small"
                                                className="text-[11px] font-bold uppercase text-blue-gray-400"
                                            >
                                                {el}
                                            </Typography>
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {users.map((user: User, key) => {
                                    const className = `py-3 px-5 ${
                                        key === users.length - 1 ? "" : "border-b border-blue-gray-50"
                                    }`;
                                    const date = user.created_at?.toString().split(" ");
                                    const id = user.user_id as number;

                                    return (
                                        <tr key={user.user_id}>
                                            <td className={className}>
                                                <div className="flex items-center gap-4">
                                                    <Avatar
                                                        src={user.url_avatar || Logo}
                                                        alt={user.user_id?.toString()}
                                                        size="xs"
                                                        variant="rounded"
                                                    />
                                                    <div>
                                                        <Typography
                                                            variant="small"
                                                            color="blue-gray"
                                                            className={`font-semibold ${
                                                                user.user_id === currentId ? "text-lightblue" : ""
                                                            }`}
                                                        >
                                                            {user.first_name} {user.last_name}
                                                        </Typography>
                                                        <Typography className="text-xs font-normal text-blue-gray-500">
                                                            {user.email}
                                                        </Typography>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className={className}>
                                                <div
                                                    className={` text-xs font-semibold ${
                                                        user.is_admin
                                                            ? "badge badge-info badge-outline"
                                                            : "badge badge-outline"
                                                    } `}
                                                >
                                                    {user.is_admin ? "Admin" : "User"}
                                                </div>
                                            </td>
                                            <td className={className}>
                                                <Typography
                                                    color={user.is_delete ? "red" : "blue-gray"}
                                                    className={`py-0.5 px-2 text-[11px] font-medium w-fit ${
                                                        user.is_delete ? "text-red-700" : "text-green-700"
                                                    }`}
                                                >
                                                    {user.is_delete ? "Deleted" : "Active"}
                                                </Typography>
                                            </td>
                                            <td className={className}>
                                                <Typography
                                                    color={user.is_delete ? "red" : "blue-gray"}
                                                    className="py-0.5 px-2 text-[11px] font-medium w-fit"
                                                >
                                                    {date![1] + " " + date![2] + " " + date![3]}
                                                </Typography>
                                            </td>
                                            {user.user_id === currentId ? (
                                                <td className={className}>
                                                    <Typography
                                                        as="text"
                                                        className="text-xs font-semibold  text-blue-gray-600"
                                                    >
                                                        None
                                                    </Typography>
                                                </td>
                                            ) : (
                                                <td className={className}>
                                                    <Typography
                                                        as="a"
                                                        href="#"
                                                        className="text-xs font-semibold hover:underline hover:cursor-pointer text-blue-gray-600"
                                                    >
                                                        Edit
                                                    </Typography>
                                                    <Typography
                                                        as="a"
                                                        href="#"
                                                        onClick={() => handleOpenDeleteModal(id)}
                                                        className="text-xs text-red-700 font-semibold hover:underline hover:cursor-pointer "
                                                    >
                                                        Delete
                                                    </Typography>
                                                </td>
                                            )}
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                        {totalPage > 1 && (
                            <div className="flex justify-center my-4 ">
                                <Pagination
                                    handleChangePageIndex={handleChangePageIndex}
                                    totalPage={totalPage}
                                    currentPage={pageIndex}
                                />
                            </div>
                        )}
                    </CardBody>
                </Card>
            </div>
        </>
    );
};

export default UserAdmin;

import React, { useEffect } from "react";
import { componentActions, statisticActions } from "../../../redux/slices";
import {
    Typography,
    Card,
    CardHeader,
    CardBody,
    IconButton,
    Menu,
    MenuHandler,
    MenuList,
    MenuItem,
    Avatar,
    Tooltip,
    Progress,
} from "@material-tailwind/react";
import {
    EllipsisVerticalIcon,
    ArrowUpIcon,
    BanknotesIcon,
    UsersIcon,
    ChartBarIcon,
    BellIcon, // orderoverview
    PlusCircleIcon,
    ShoppingCartIcon,
    CreditCardIcon,
    LockOpenIcon,
} from "@heroicons/react/24/outline";
import { StatisticsCard } from "../../../components/Card/StatisticsCard";
import { StatisticsChart } from "../../../components/Chart/StatisticsChart";
import { CheckCircleIcon, ClockIcon } from "@heroicons/react/24/solid";

import { chartsConfig } from "../../../config/chartsConfig";
import { useAppDispatch, useAppSelector } from "../../../hooks/hooks";

const websiteViewsChart = {
    type: "bar",
    height: 220,
    series: [
        {
            name: "Views",
            data: [50, 20, 10, 22, 50, 10, 40],
        },
    ],
    options: {
        ...chartsConfig,
        colors: "#388e3c",
        plotOptions: {
            bar: {
                columnWidth: "16%",
                borderRadius: 5,
            },
        },
        xaxis: {
            ...chartsConfig.xaxis,
            categories: ["M", "T", "W", "T", "F", "S", "S"],
        },
    },
};

const dailySalesChart = {
    type: "line",
    height: 220,
    series: [
        {
            name: "Sales",
            data: [50, 40, 300, 320, 500, 350, 200, 230, 500],
        },
    ],
    options: {
        ...chartsConfig,
        colors: ["#0288d1"],
        stroke: {
            lineCap: "round",
        },
        markers: {
            size: 5,
        },
        xaxis: {
            ...chartsConfig.xaxis,
            categories: ["Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
        },
    },
};

const completedTaskChart = {
    type: "line",
    height: 220,
    series: [
        {
            name: "Sales",
            data: [50, 40, 300, 320, 500, 350, 200, 230, 500],
        },
    ],
    options: {
        ...chartsConfig,
        colors: ["#388e3c"],
        stroke: {
            lineCap: "round",
        },
        markers: {
            size: 5,
        },
        xaxis: {
            ...chartsConfig.xaxis,
            categories: ["Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
        },
    },
};
const completedTasksChart = {
    ...completedTaskChart,
    series: [
        {
            name: "Tasks",
            data: [50, 40, 300, 220, 500, 250, 400, 230, 500],
        },
    ],
};

export const statisticsChartsData = [
    {
        color: "white",
        title: "Website View",
        description: "Last Campaign Performance",
        footer: "campaign sent 2 days ago",
        chart: websiteViewsChart,
    },
    {
        color: "white",
        title: "Daily Sales",
        description: "15% increase in today sales",
        footer: "updated 4 min ago",
        chart: dailySalesChart,
    },
    {
        color: "white",
        title: "Completed Tasks",
        description: "Last Campaign Performance",
        footer: "just updated",
        chart: completedTasksChart,
    },
];

const projectsTableData = [
    {
        img: "/img/logo-xd.svg",
        name: "Material XD Version",
        members: [
            { img: "/img/team-1.jpeg", name: "Romina Hadid" },
            { img: "/img/team-2.jpeg", name: "Ryan Tompson" },
            { img: "/img/team-3.jpeg", name: "Jessica Doe" },
            { img: "/img/team-4.jpeg", name: "Alexander Smith" },
        ],
        budget: "$14,000",
        completion: 60,
    },
    {
        img: "/img/logo-atlassian.svg",
        name: "Add Progress Track",
        members: [
            { img: "/img/team-2.jpeg", name: "Ryan Tompson" },
            { img: "/img/team-4.jpeg", name: "Alexander Smith" },
        ],
        budget: "$3,000",
        completion: 10,
    },
    {
        img: "/img/logo-slack.svg",
        name: "Fix Platform Errors",
        members: [
            { img: "/img/team-3.jpeg", name: "Jessica Doe" },
            { img: "/img/team-1.jpeg", name: "Romina Hadid" },
        ],
        budget: "Not set",
        completion: 100,
    },
    {
        img: "/img/logo-spotify.svg",
        name: "Launch our Mobile App",
        members: [
            { img: "/img/team-4.jpeg", name: "Alexander Smith" },
            { img: "/img/team-3.jpeg", name: "Jessica Doe" },
            { img: "/img/team-2.jpeg", name: "Ryan Tompson" },
            { img: "/img/team-1.jpeg", name: "Romina Hadid" },
        ],
        budget: "$20,500",
        completion: 100,
    },
    {
        img: "/img/logo-jira.svg",
        name: "Add the New Pricing Page",
        members: [{ img: "/img/team-4.jpeg", name: "Alexander Smith" }],
        budget: "$500",
        completion: 25,
    },
    {
        img: "/img/logo-invision.svg",
        name: "Redesign New Online Shop",
        members: [
            { img: "/img/team-1.jpeg", name: "Romina Hadid" },
            { img: "/img/team-4.jpeg", name: "Alexander Smith" },
        ],
        budget: "$2,000",
        completion: 40,
    },
];
const ordersOverviewData = [
    {
        icon: BellIcon,
        color: "text-blue-gray-300",
        title: "$2400, Design changes",
        description: "22 DEC 7:20 PM",
    },
    {
        icon: PlusCircleIcon,
        color: "text-blue-gray-300",
        title: "New order #1832412",
        description: "21 DEC 11 PM",
    },
    {
        icon: ShoppingCartIcon,
        color: "text-blue-gray-300",
        title: "Server payments for April",
        description: "21 DEC 9:34 PM",
    },
    {
        icon: CreditCardIcon,
        color: "text-blue-gray-300",
        title: "New card added for order #4395133",
        description: "20 DEC 2:20 AM",
    },
    {
        icon: LockOpenIcon,
        color: "text-blue-gray-300",
        title: "Unlock packages for development",
        description: "18 DEC 4:54 AM",
    },
    {
        icon: BanknotesIcon,
        color: "text-blue-gray-300",
        title: "New order #9583120",
        description: "17 DEC",
    },
];

export function Home() {
    const dispatch = useAppDispatch();
    const totalMoney = useAppSelector((state) => state.statisticSlice.totalMoney);
    const totalCourse = useAppSelector((state) => state.statisticSlice.totalCourse);
    const totalUser = useAppSelector((state) => state.statisticSlice.totalUser);
    // const categoryCourse = useAppSelector((state) => state.statisticSlice.categoryCourse);
    // const categoryEnrolled = useAppSelector((state) => state.statisticSlice.categoryEnrolled);
    // const categoryMoney = useAppSelector((state) => state.statisticSlice.categoryMoney);
    const statisticsCardsData = [
        {
            color: "gray",
            icon: BanknotesIcon,
            title: "Total Money",
            value: totalMoney,
            // footer: {
            //     color: "text-green-500",
            //     value: "+55%",
            //     label: "than last week",
            // },
        },
        {
            color: "green",
            icon: UsersIcon,
            title: "Total Users",
            value: totalUser,
            footer: {
                color: "text-green-500",
                value: "+3%",
                label: "than last month",
            },
        },
        {
            color: "red",
            icon: ChartBarIcon,
            title: "Total course",
            value: totalCourse,
            footer: {
                color: "text-green-500",
                value: "+5%",
                label: "than yesterday",
            },
        },
    ];
    useEffect(() => {
        dispatch(componentActions.setAdminNavPlace("dashboard"));
        dispatch(statisticActions.getTotalCourse());
        dispatch(statisticActions.getTotalMoney());
        dispatch(statisticActions.getTotalUser());
    });
    return (
        <div className="pt-[15px] bg-background_2">
            <div className="mb-12 grid gap-y-10 items-center gap-x-6 md:grid-cols-2 xl:grid-cols-4">
                {statisticsCardsData.map(({ icon, title, footer, ...rest }) => (
                    <StatisticsCard
                        key={title}
                        {...rest}
                        title={title}
                        value={rest.value}
                        icon={React.createElement(icon, {
                            className: "w-6 h-6 text-white",
                        })}
                    />
                ))}
            </div>
            <div className="mb-6 grid grid-cols-1 gap-y-12 gap-x-6 md:grid-cols-2 xl:grid-cols-3">
                {statisticsChartsData.map((props: any) => (
                    <StatisticsChart
                        key={props.title}
                        {...props}
                        footer={
                            <Typography variant="small" className="flex items-center font-normal text-blue-gray-600">
                                <ClockIcon strokeWidth={2} className="h-4 w-4 text-blue-gray-400" />
                                &nbsp;{props.footer}
                            </Typography>
                        }
                    />
                ))}
            </div>
            <div className="mb-4 grid grid-cols-1 gap-6 xl:grid-cols-3">
                <Card className="overflow-hidden xl:col-span-2 border border-blue-gray-100 shadow-sm">
                    <CardHeader
                        floated={false}
                        shadow={false}
                        color="transparent"
                        className="m-0 flex items-center justify-between p-6"
                    >
                        <div>
                            <Typography variant="h6" color="blue-gray" className="mb-1">
                                Projects
                            </Typography>
                            <Typography
                                variant="small"
                                className="flex items-center gap-1 font-normal text-blue-gray-600"
                            >
                                <CheckCircleIcon strokeWidth={3} className="h-4 w-4 text-blue-gray-200" />
                                <strong>30 done</strong> this month
                            </Typography>
                        </div>
                        <Menu placement="left-start">
                            <MenuHandler>
                                <IconButton size="sm" variant="text" color="blue-gray">
                                    <EllipsisVerticalIcon strokeWidth={3} fill="currenColor" className="h-6 w-6" />
                                </IconButton>
                            </MenuHandler>
                            <MenuList>
                                <MenuItem>Action</MenuItem>
                                <MenuItem>Another Action</MenuItem>
                                <MenuItem>Something else here</MenuItem>
                            </MenuList>
                        </Menu>
                    </CardHeader>
                    <CardBody className="overflow-x-scroll px-0 pt-0 pb-2">
                        <table className="w-full min-w-[640px] table-auto">
                            <thead>
                                <tr>
                                    {["companies", "members", "budget", "completion"].map((el) => (
                                        <th key={el} className="border-b border-blue-gray-50 py-3 px-6 text-left">
                                            <Typography
                                                variant="small"
                                                className="text-[11px] font-medium uppercase text-blue-gray-400"
                                            >
                                                {el}
                                            </Typography>
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {projectsTableData.map(({ img, name, members, budget, completion }, key) => {
                                    const className = `py-3 px-5 ${
                                        key === projectsTableData.length - 1 ? "" : "border-b border-blue-gray-50"
                                    }`;

                                    return (
                                        <tr key={name}>
                                            <td className={className}>
                                                <div className="flex items-center gap-4">
                                                    <Avatar src={img} alt={name} size="sm" />
                                                    <Typography variant="small" color="blue-gray" className="font-bold">
                                                        {name}
                                                    </Typography>
                                                </div>
                                            </td>
                                            <td className={className}>
                                                {members.map(({ img, name }, key) => (
                                                    <Tooltip key={name} content={name}>
                                                        <Avatar
                                                            src={img}
                                                            alt={name}
                                                            size="xs"
                                                            variant="circular"
                                                            className={`cursor-pointer border-2 border-white ${
                                                                key === 0 ? "" : "-ml-2.5"
                                                            }`}
                                                        />
                                                    </Tooltip>
                                                ))}
                                            </td>
                                            <td className={className}>
                                                <Typography
                                                    variant="small"
                                                    className="text-xs font-medium text-blue-gray-600"
                                                >
                                                    {budget}
                                                </Typography>
                                            </td>
                                            <td className={className}>
                                                <div className="w-10/12">
                                                    <Typography
                                                        variant="small"
                                                        className="mb-1 block text-xs font-medium text-blue-gray-600"
                                                    >
                                                        {completion}%
                                                    </Typography>
                                                    <Progress
                                                        value={completion}
                                                        variant="gradient"
                                                        color={completion === 100 ? "green" : "blue"}
                                                        className="h-1"
                                                    />
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </CardBody>
                </Card>
                <Card className="border border-blue-gray-100 shadow-sm">
                    <CardHeader floated={false} shadow={false} color="transparent" className="m-0 p-6">
                        <Typography variant="h6" color="blue-gray" className="mb-2">
                            Orders Overview
                        </Typography>
                        <Typography variant="small" className="flex items-center gap-1 font-normal text-blue-gray-600">
                            <ArrowUpIcon strokeWidth={3} className="h-3.5 w-3.5 text-green-500" />
                            <strong>24%</strong> this month
                        </Typography>
                    </CardHeader>
                    <CardBody className="pt-0">
                        {ordersOverviewData.map(({ icon, color, title, description }, key) => (
                            <div key={title} className="flex items-start gap-4 py-3">
                                <div
                                    className={`relative p-1 after:absolute after:-bottom-6 after:left-2/4 after:w-0.5 after:-translate-x-2/4 after:bg-blue-gray-50 after:content-[''] ${
                                        key === ordersOverviewData.length - 1 ? "after:h-0" : "after:h-4/6"
                                    }`}
                                >
                                    {React.createElement(icon, {
                                        className: `!w-5 !h-5 ${color}`,
                                    })}
                                </div>
                                <div>
                                    <Typography variant="small" color="blue-gray" className="block font-medium">
                                        {title}
                                    </Typography>
                                    <Typography
                                        as="span"
                                        variant="small"
                                        className="text-xs font-medium text-blue-gray-500"
                                    >
                                        {description}
                                    </Typography>
                                </div>
                            </div>
                        ))}
                    </CardBody>
                </Card>
            </div>
        </div>
    );
}

export default Home;

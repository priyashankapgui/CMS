import React from "react";
import * as RiIcons from "react-icons/ri";
import { Icon } from '@iconify/react'
export const SidebarData = [
    {
        title: "Branch Mgmt",
        icon: <Icon icon="solar:shop-linear" style={{ fontSize: '22px' }} />,
        iconClosed: <RiIcons.RiArrowDownSFill />,
        iconOpened: <RiIcons.RiArrowUpSFill />,

        subNav: [
            {
                title: "Adjust Branch",
                path: "/adjust-branch",
            },
            {
                title: "Accounts",
                path: "/accounts",
            },
        ],
    },
    {
        title: "Inventory Mgmt",
        icon: <Icon icon="carbon:inventory-management" style={{ fontSize: '22px' }} />,
        iconClosed: <RiIcons.RiArrowDownSFill />,
        iconOpened: <RiIcons.RiArrowUpSFill />,

        subNav: [
            {
                title: "Products",
                path: "/products",
                cName: "sub-nav",
            },
            {
                title: "Suppliers",
                path: "/suppliers",
                cName: "sub-nav",
            },
            {
                title: "Good Receive",
                path: "/good-receive",
                cName: "sub-nav",
            },
            {
                title: "Stock Balance",
                path: "/stock-balance",
                cName: "sub-nav",
            },
            {
                title: "Stock Transfer",
                path: "/stock-transfer",
                cName: "sub-nav",
            },

            {
                title: "Check Price",
                path: "/check-price",
                cName: "sub-nav",
            },
        ],
    },
    {
        title: "Billing",
        icon: <Icon icon="solar:bill-check-linear" style={{ fontSize: '22px' }} />,
        iconClosed: <RiIcons.RiArrowDownSFill />,
        iconOpened: <RiIcons.RiArrowUpSFill />,

        subNav: [
            {
                title: "Sales",
                path: "/sales",
            },
            {
                title: "Work List",
                path: "/work-list",
            },
        ],
    },

    {
        title: "Online Orders",
        path: "/online-orders",
        icon: <Icon icon="tdesign:shop" style={{ fontSize: '22px' }} />,
    },
    {
        title: "Web Mgmt",
        path: "/web-mgmt",
        icon: <Icon icon="lucide:webhook" style={{ fontSize: '22px' }} />,
    },
    {
        title: "Web Feedbacks",
        path: "/web-feedbacks",
        icon: <Icon icon="mdi:feedback-outline" style={{ fontSize: '22px' }} />,
    },
    {
        title: "Reporting",
        path: "/reporting/analysis",
        icon: <Icon icon="mdi:chart-donut" style={{ fontSize: '22px' }} />,
    },
 
];

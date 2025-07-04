import * as Icons from "../icons";

export const NAV_DATA = [
  {
    label: "MAIN MENU",
    items: [
      {
        title: "Dashboard",
        icon: Icons.HomeIcon,
        items: [
          {
            title: "eCommerce",
            url: "/",
          },
        ],
      },
      // {
      //   title: "Product",
      //   url: "/calendar",
      //   icon: Icons.Calendar,
      //   items: [],
      // },
      {
        title: "Profile",
        url: "/profile",
        icon: Icons.User,
        items: [],
      },
      {
        title: "Product",
        icon: Icons.Alphabet,
        items: [
          {
            title: "ALL Product",
            url: "/allproduct",
          },
          // {
          //   title: "EDIT PRODUCT",
          //   url: "/forms/form-layout",
          // },
          //  {
          //   title: "ADD PRODUCT",
          //   url: "/forms/form-layout",
          // },
          // {
          //   title: "Set pricing",
          //   url: "/pages/settings",
          // },
          // {
          //   title: "Manage product images",
          //   url: "/pages/settings",
          // },
          // {
          //   title: "Set categories",
          //   url: "/pages/settings",
          // },
        ],
      },


       {
        title: "subcategories",
        icon: Icons.Alphabet,
        items: [
          {
            title: "subcategories",
            url: "/subcategories",
          },
         
        ],
      },

      {
        title: "categories",
        icon: Icons.Alphabet,
        items: [
          {
            title: "categories",
            url: "/categories",
          },
         
        ],
      },
     
       {
        title: "USERS",
        icon: Icons.Alphabet,
        items: [
          {
            title: "all USER",
            url: "/users",
          },
          {
            title: "EDIT USER",
            url: "/forms/form-layout",
          },
        ],
      },
      

      {
        title: "ORDERS",
        url: "/tables",
        icon: Icons.Table,
        items: [
          {
            title: "ALL orders",
            url: "/orders",
          },
        
        ],
      },
      // {
      //   title: "Pages",
      //   icon: Icons.Alphabet,
      //   items: [
      //     {
      //       title: "LOGIN",
      //       url: "/pages/settings",
      //     },
      //      {
      //       title: "LOGOUT",
      //       url: "/pages/settings",
      //     },
      //     {
      //       title: "FORGOT",
      //       url: "/pages/settings",
      //     },
          
      //   ],
      // },

      // {
      //   title: "Customer Management",
      //   icon: Icons.Alphabet,
      //   items: [
      //     {
      //       title: "View customer list",
      //       url: "/pages/settings",
      //     },
      //      {
      //       title: "Order history per customer",
      //       url: "/pages/settings",
      //     },
      //     {
      //       title: "ADD customer ",
      //       url: "/pages/settings",
      //     },
      //      {
      //       title: "edit customer",
      //       url: "/pages/settings",
      //     },
           
          
      //   ],
      // },

      //  {
      //   title: "Inventory Management",
      //   icon: Icons.Alphabet,
      //   items: [
      //     {
      //       title: "View stock ",
      //       url: "/pages/settings",
      //     },
      //      {
      //       title: "Low stock",
      //       url: "/pages/settings",
      //     },
      //     {
      //       title: "Manual stock ",
      //       url: "/pages/settings",
      //     },
      //      {
      //       title: "Inventory reports",
      //       url: "/pages/settings",
      //     },
           
          
      //   ],
      // }
      
    ],
  },
  // {
  //   label: "OTHERS",
  //   items: [
  //     {
  //       title: "Charts",
  //       icon: Icons.PieChart,
  //       items: [
  //         {
  //           title: "Basic Chart",
  //           url: "/charts/basic-chart",
  //         },
  //       ],
  //     },
  //     {
  //       title: "UI Elements",
  //       icon: Icons.FourCircle,
  //       items: [
  //         {
  //           title: "Alerts",
  //           url: "/ui-elements/alerts",
  //         },
  //         {
  //           title: "Buttons",
  //           url: "/ui-elements/buttons",
  //         },
  //       ],
  //     },
  //     {
  //       title: "Authentication",
  //       icon: Icons.Authentication,
  //       items: [
  //         {
  //           title: "Sign In",
  //           url: "/auth/sign-in",
  //         },
  //       ],
  //     },
  //   ],
  // },
];

import { FaHome, FaUser, FaBoxOpen, FaSitemap, FaListAlt, FaUsers, FaClipboardList, FaMoneyCheckAlt } from "react-icons/fa";
import { MdCategory } from "react-icons/md";

export const NAV_DATA = [
  {
    label: "MAIN MENU",
    items: [
      {
        title: "Dashboard",
       
        icon: FaHome,
         url: "/",
        items: [
          
        ],
      },

      {
        
        title: "Products",
        icon: FaBoxOpen,
           items: [
            {
            title: "All Products",
             url: "/allproduct",
          },
          {
            title: "All categories",
            url: "/categories",
          },

          {
            title: "All Variations",
            url: "/all_Variations",
          },
           {
            title: "All Brands",
            url: "/all_Brands",
          },
           {
            title: "All Units",
            url: "/all_units",
          },
            {
            title: "All Taxes",
            url: "/all_Taxes",
          },
    
        ],
      }, 
      
       {
        title: "Users",
        icon: FaUsers,
        items: [
          {
            title: "User List",
            url: "/users",
          },
          {
            title: "Admins",
            url: "/admin",
          },
        ],
      },

    


      {
        title: "Categories",
        icon: MdCategory,
         url: "/categories",
        items: [
         
        ],
      },
      {
        title: "Subcategories",
        icon: FaSitemap,
         url: "/new_subcategories",
        items: [
         
        ],
      },
    
        {
        title: "Orders",
        icon: FaClipboardList,
         url: "/orders",
        items: [
          
        ],
      },
       {
        title: "Payment",
         icon: FaMoneyCheckAlt,
        url: "/payment",
        
        items: [],
      },

      {
        title: "Profile",
        url: "/profile",
        icon: FaUser,
        items: [],
      },
      
      
      
     
    
    ],
  },
];

export interface menu {
  header?: string;
  group?: string;
  model?: boolean;
  title?: any;
  icon?: string;
  to?: any;
  children?: menu[];
  permissions?:string
  group_name?:string
}

const sidebarItem: menu[] = [
  { header: "Main", group_name:"" },
  {
    title: "Dashboard",
    icon: "pie-chart",
    to: "/dashboards/analytical",
    permissions:""
  },
  {
    title: "Withdrawals",
    icon: "credit-card",
    to: "/withdrawals/all",
    permissions:"manage_wallet_transactions"
  },
 
  {
    title: "Giftcard Transactions",
    icon: "gift",       
    to: "/giftcards/transaction",
    permissions:"manage_giftcards"
  },
  
  {
    title: "Asset Transaction",
    icon: "trending-down",
    to: "/asset/transaction",
    permissions:"manage_asset_transactions"
  },
  {
    title: "Top Traders",
    icon: "credit-card",
    to: "/top-traders/transaction",
    permissions:""
  },
 
  { header: "Users", group_name:"user"},
  {
    title: "Users",
    icon: "copy",
    to: "/user/all",
    permissions:"manage_users"
  },
  {
    title: "Admin",
    icon: "users",
    to: "/admin",
    permissions:"manage_admins"
  },
  
  {
    title: "Roles & Permissions",
    icon: "user-plus",
    to: "/roles",
    permissions:"manage_access_control_list"
  },

  { header: "Notifications", group_name:"notification" },
  {
    title: "Announcements",
    icon: "bell",
    to: "/announcements",
    permissions:'manage_alerts'
  },
  {
    title: "Notifications",
    icon: "user-plus",
    to: "/notifications/all",
    permissions:"receive_notifications"
  },

  { header: "Settings",  group_name:"giftcard"  },

  {
    title:"GiftCard Mgt",
    icon:"gift",
    group_name:"giftcard",
    children: [

      {
        title: "Categories",
        icon: "",
        to: "/giftcards/categories",
        permissions:"manage_giftcard_categories"
      },
      {
        title: "Products",
        icon: "",
        to: "/giftcards/products",
        permissions:"manage_giftcard_products"
      },
],
  },
  {
    title:"Crypto",
    icon:"cpu",
    group_name:'crypto',
    children: [

      {
        title: "Networks",
        icon: "",
        to: "/networks/all",
        permissions:"manage_networks"
      },
      {
        title: "Assets",
        icon: "",
        to: "/assets/all",
        permissions:"manage_assets"
      },
      {
        title: "Currencies",
        icon: "",
        to: "/currencies/all",
        permissions:"manage_currencies"
      },
],
  },
  {
    title:"Configuration",
    icon:"command",
    group_name:'config',
    children: [

      {
        title: "Banners",
        icon: "",
        to: "/banners",
        permissions:"manage_system_data"
      },
      {
        title: "App version",
        icon: "",
        to: "/system-data",
        permissions:"manage_system_data"
      },
      {
        title: "Countries Mgt",
        icon: "",
        to: "/countries/all",
        permissions:"manage_countries"
      },
      {
        title: "System bank account",
        icon: "users",
        to: "/system-bank",
        permissions:"manage_system_bank_accounts"
      },
],
  }

 
];

export default sidebarItem;

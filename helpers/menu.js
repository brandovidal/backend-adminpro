const getMenu = (role) => {
  const menu = [
    {
      title: "Dashboard",
      icon: "mdi mdi-gauge",
      submenu: [
        { title: "Main", url: "/" },
        { title: "Gráficas", url: "grafica1" },
        { title: "ProgressBar", url: "progress" },
        { title: "Promesas", url: "promises" },
        { title: "Rxjs", url: "rxjs" },
      ],
    },
    {
      title: "Maintenance",
      icon: "mdi mdi-folder-lock-open",
      submenu: [
        { title: "Medicos", url: "doctors" },
        { title: "Hospitals", url: "hospitals" },
        // { title: "Users", url: "users" },
      ],
    },
  ];

  if (role.includes("ADMIN_ROLE")) {
    menu[1].submenu.unshift({ title: "Users", url: "users" });
  }

  return menu;
};

module.exports = {
  getMenu,
};

// Выход из личного кабинета
let logoutBtn = new LogoutButton();

logoutBtn.action = () => {
    ApiConnector.logout((response) => {
        if (response.success) {
            location.reload();
        } 
    });
};

// Получение информации о пользователе
ApiConnector.current((response) => {
    if (response.success) {
        ProfileWidget.showProfile(response.data);
    } 
});

// Получение текущих курсов валюты
let ratesBoard = new RatesBoard();

let fetchRates = () => {
    ApiConnector.getStocks((response) => {
        if (response.success) {
            ratesBoard.clearTable();
            ratesBoard.fillTable(response.data);
        } 
    });
}

fetchRates();

let timeInterval = setInterval(() => fetchRates(), 60000);

//Операции с деньгами
let moneyManager = new MoneyManager();

moneyManager.addMoneyCallback = (data) => {
    ApiConnector.addMoney(data, (response) => {
        if (response.success) {
            ProfileWidget.showProfile(response.data);
            moneyManager.setMessage(true, "Баланс пололнен");
        } else {
            moneyManager.setMessage(false, response.error); 
        }
    });
};

moneyManager.conversionMoneyCallback = (data) => {
    ApiConnector.convertMoney(data, (response) => {
        if (response.success) {
            ProfileWidget.showProfile(response.data);
            moneyManager.setMessage(true, "Конвертация валют произошла");
        } else {
            moneyManager.setMessage(false, response.error);
        }
    });
};

moneyManager.sendMoneyCallback = (data) => {
    ApiConnector.transferMoney(data, (response) => {
        if (response.success) {
            ProfileWidget.showProfile(response.data);
            moneyManager.setMessage(true, "Деньги переведенны");
        } else {
            moneyManager.setMessage(false, response.error);
        }
    });
};

//Работа с избранным
let favoritesWidget = new FavoritesWidget();

ApiConnector.getFavorites((response) => {
    if (response.success) {
        favoritesWidget.clearTable();
        favoritesWidget.fillTable(response.data);
        moneyManager.updateUsersList(response.data);
    } 
});

favoritesWidget.addUserCallback = (data) => {
    ApiConnector.addUserToFavorites(data, (response) => {
        if (response.success) {
            favoritesWidget.clearTable();
            favoritesWidget.fillTable(response.data);
            moneyManager.updateUsersList(response.data);
            favoritesWidget.setMessage(true, "Пользователь добавлен в избранное");
        } else {
            favoritesWidget.setMessage(false, response.error);
        }
    });
};

favoritesWidget.removeUserCallback = data => {
    ApiConnector.removeUserFromFavorites(data,(response) => {
        if (response.success) {
            favoritesWidget.clearTable();
            favoritesWidget.fillTable(response.data);
            moneyManager.updateUsersList(response.data);
            favoritesWidget.setMessage(true, "Пользователь удален из избранного");
        } else {
            favoritesWidget.setMessage(false, response.error);
        }
    });
}
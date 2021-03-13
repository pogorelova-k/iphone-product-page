document.addEventListener("DOMContentLoaded", () => {
  // при загрузки дом-дерева , запуститься скрипт

  const COUNT_ROW_GOODS = 4;
  
  const getData = (url, callback) => {
    const request = new XMLHttpRequest(); // стадия 0-создание XMLHttpRequest - API, функциональность которого позволяют клиенту обмеиваться данными с сервером

    request.open('GET', url); //стадия 1-инициализация, когда настраивается соединение: при срабатывании метода open

    request.addEventListener('readystatechange', () => { // стадия 2, 3 и 4
      if (request.readyState !== 4) return;
      if (request.status === 200) { // проверяем успешно ли выполнен запрос
        const response = JSON.parse(request.response);
        callback(response);
      } else {
        console.error(new Error('Ошибка:' + request.statusText));
      }
    });

    request.send(); // стадия 3-
  };

  const renderCrossSell = () => {
    const crossSellList = document.querySelector('.cross-sell__list');
    const crossSellAdd = document.querySelector('.cross-sell__add');
    const allGoods = [];
    let wrapRender = null;


    // функция рандома, чтобы выводить по 4 рандомных товара
    // функция фишер идс лучше использовать вместо этой
    const shuffle = arr => arr.sort(() => Math.random() - 0.5 );

    // функция, которая добавляет товары из dbase.json
    // деструктуризация - вытащить свойства котореы нужны
    const createCrossSellItem = ({ photo, name, price }) => {

      // создаем li элемент
      const liItem = document.createElement('li');
      // вставляем верстку в Li
      liItem.innerHTML = `
                <article class="cross-sell__item">
                  <img class="cross-sell__image" src="${photo}" alt="${name}">
                  <h3 class="cross-sell__title">${name}</h3>
                  <p class="cross-sell__price">${price} р</p>
                  <button type="button" class="button button_buy cross-sell__button">Купить</button>
                </article>
      `;
      return liItem;
    }

    const render = arr => {
      arr.forEach(item => {
        crossSellList.append(createCrossSellItem(item));
      })
    }

    const wrapper = (fn, count) => {
      let counter = 0;
      return (...args) => {
        if (counter === count) return;
        counter++;
        return fn(...args);

      }
    };

    // получеам и перебираем массив данных
    const createCrossSellList = (goods) => {

      wrapRender = wrapper(render, parseInt(goods.length/COUNT_ROW_GOODS) + 1);

      allGoods.push(...shuffle(goods))
      // перемешанные товары по 4
      const fourItems = allGoods.splice(0, COUNT_ROW_GOODS);
      render(fourItems);
    };

    crossSellAdd.addEventListener('click', () => {
      wrapRender(allGoods.splice(0, COUNT_ROW_GOODS));
      
      if (allGoods.length === length) {
        crossSellAdd.remove();
      }
    })

    // рандомные 4 товара показываются каждые 5 секунд
    // const createCrossSellList = (goods = []) => {
    //   allGoods.push(...shuffleGoods)
    //   crossSellList.textContent = '';
    //   const shuffleGoods = shuffle(allGoods);
    //   const fourItems = shuffleGoods.slice(0, 4);
    //   fourItems.forEach(item => {
    //     crossSellList.append(createCrossSellItem(item));
    //   })
    //   setTimeout(createCrossSellList, 5000)
    // };


    // получаем данные по этому адресу и они прилетают в createCrossSellList
    getData('cross-sell-dbase/dbase.json', createCrossSellList);
  };

  // !ТАБЫ ПЕРЕКЛЮЧЕНИЯ ЦВЕТА ТЕЛЕФОНА С ОПИСАНИЕМ
  const tabs = () => {
    const cardDetailChangeElems = document.querySelectorAll(".card-detail__change");
    const cardDetailsTitleElems = document.querySelector(".card-details__title");
    const cardImageItemElem = document.querySelector(".card__image_item");
    const cardDetailsPriceElem = document.querySelector(".card-details__price");
    const descriptionMemory = document.querySelector(".description__memory");

    // данные которые меняем
    const data = [
      {
        name: "Смартфон Apple iPhone 12 Pro 128GB Graphite",
        img: "img/iPhone-graphite.png",
        price: 95990,
        memoryROM: 128,
      },
      {
        name: "Смартфон Apple iPhone 12 Pro 256GB Silver",
        img: "img/iPhone-silver.png",
        price: 120990,
        memoryROM: 256,
      },
      {
        name: "Смартфон Apple iPhone 12 Pro 128GB Pacific Blue",
        img: "img/iPhone-blue.png",
        price: 99990,
        memoryROM: 128,
      },
    ];

    const deactive = () => {
      cardDetailChangeElems.forEach((btn) => {
        btn.classList.remove("active");
      });
    };

    cardDetailChangeElems.forEach((btn, i) => {
      btn.addEventListener("click", () => {
        if (!btn.classList.contains("active")) {
          deactive();
          btn.classList.add("active");
          cardDetailsTitleElems.textContent = data[i].name;
          cardImageItemElem.src = data[i].img;
          cardImageItemElem.alt = data[i].img;
          cardDetailsPriceElem.textContent = data[i].price + "p";
          descriptionMemory.textContent = `Встроенная память (ROM) ${data[i].memoryROM} ГБ`;
        }
      });
    });
    

    // второй вариант переключения табов
    // const cardImageElems = document.querySelectorAll('.card__image');

    // const hideAll = () => {
    //     for (let i = 0; i < cardDetailChangeElems.length; i++) {
    //         cardDetailChangeElems[i].classList.remove('active');
    //         cardDetailsTitleElems[i].classList.remove('active');
    //         cardImageElems[i].classList.remove('active');
    //     }
    // };

    // for (let i = 0; i < cardDetailChangeElems.length; i++) {
    //     cardDetailChangeElems[i].addEventListener('click', () => {
    //         hideAll();
    //         cardDetailChangeElems[i].classList.add('active');
    //         cardDetailsTitleElems[i].classList.add('active');
    //         cardImageElems[i].classList.add('active');
    //     });
    // };
  };

  // !ВЫПАДАЮЩИЕ СПИСКИ С ОПИСАНИЕМ
  const accordeon = () => {
    const characteristicsListElem = document.querySelector('.characteristics__list');
    const characteristicsItemElems = document.querySelectorAll('.characteristics__item');
    
    characteristicsItemElems.forEach(element => {
      if (element.children[1].classList.contains('active')) {
        element.children[1].style.height = `${element.children[1].scrollHeight}px`;
      }
    })

    // функция открытия описания
    const open = (button, dropDown) => {
      closeAllDrops(button, dropDown);
      dropDown.style.height = `${dropDown.scrollHeight}px`; //дает плавность раскрытия списка
      button.classList.add('active');
      dropDown.classList.add('active');
    };

    // функция закрытия описания
    const close = (button, dropDown) => {
      button.classList.remove('active');
      dropDown.classList.remove('active');
      dropDown.style.height = '';
    };

    // функция закрытия всех выпадающих списков
    const closeAllDrops = (button, dropDown) => {
      characteristicsItemElems.forEach((elem) => {
        if (elem.children[0] !== button && elem.children[1] !== dropDown) {
          close(elem.children[0], elem.children[1]);
        };
      });
    };

    // открытие/закрытие описания по клику на кнопку 
    characteristicsListElem.addEventListener('click', (event) => {
      const target = event.target;
      if (target.classList.contains('characteristics__title')) {
        const parent = target.closest('.characteristics__item');
        const description = parent.querySelector('.characteristics__description');
        description.classList.contains('active') ? close(target, description) : open(target, description);
      } 
    });

    // закрытиые всех выпадающих списков, при клике на странице в любом месте
    document.body.addEventListener('click', (event) => {
      const target = event.target;
      if (!target.closest('.characteristics__list')) {
        closeAllDrops();
      }
    });


    // const characteristicsTitle = document.querySelectorAll('.characteristics__title');
    // const characteristicsDescription = document.querySelectorAll('.characteristics__description');

    // characteristicsTitle.forEach((elem, i) => {
    //   elem.addEventListener('click', () => {
    //     elem.classList.toggle('active');
    //     characteristicsDescription[i].classList.toggle('active');
    //   });     
    // });
  };

  //  !МОДАЛЬНОЕ ОКНО  
  const modal = () => {
    const cardDetailsButtonBuy = document.querySelector('.card-details__button_buy');
    const cardDetailsButtonDelivery = document.querySelector('.card-details__button_delivery');
    const modal = document.querySelector('.modal');
    const cardDetailsTitleElem = document.querySelector(".card-details__title");
    const modalTitle = modal.querySelector('.modal__title');
    const modalSubTitle = modal.querySelector('.modal__subtitle');
    const modalTitleSubmit = modal.querySelector('.modal__title-submit');
    const modalButtonBuy = modal.querySelector('.button_buy');

    // функция открытия модального окна
    const openModal = (event) => {
      const target = event.target;
      modal.classList.add('open'); // открываем модальное окно
      document.addEventListener('keydown', escapeHandler); // закрываем по кнопке esc 
      modalTitle.textContent = cardDetailsTitleElem.textContent; // название телефона переносим в модальное окно
      modalTitleSubmit.value = cardDetailsTitleElem.textContent; //значение для передачи названия телефона, который хотят купить
      modalSubTitle.textContent = target.dataset.buttonBuy; // оплата и доставка, оплата
      modalButtonBuy.textContent = modalSubTitle.textContent; // 'оплата на кнопку в модальном окне
    };

    // функция закрытия модального окна
    const closeModal = () => {
      modal.classList.remove('open');
      document.removeEventListener('keydown', escapeHandler);
    };

    // функция закрытия по кнопке esc 
    const escapeHandler = event => {
      if (event.code === "Escape") {
        closeModal();
      }
    }

    // закрытие модального окна на крестик или за его пределами
    modal.addEventListener('click', (event) => {
      const target = event.target;
      if (target.classList.contains('modal__close') || target === modal) {
        closeModal(); 
      }
    });

    // открытие модального окна при клике на 'купить'
    cardDetailsButtonBuy.addEventListener('click', openModal);
    
    // открытие модального окна по кнопке 'доставка'
    cardDetailsButtonDelivery.addEventListener('click', openModal);
  };

  tabs();
  accordeon(); 
  modal();
  renderCrossSell();
  amenu('.header__menu', '.header-menu__list', '.header-menu__item', ".header-menu__burger");
});
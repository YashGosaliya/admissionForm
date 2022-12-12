# Application overview -

-   Distributed microservice architecture for high scalability.
-   Build on three services - _Payments_ , _Customer_ , _Frontend_.
-   All microserives are highly decoupled.
-   This app follows the Event driven architecture.
-   Frontend is made using **React JS** using the functional components.
-   For Database **MongoDB** is used .
-   **RazorPay** is used for doing payments .
-   **RabbitMq** is used as Message Queue for triggering events.
-   **NGINX** is used as reverse proxy for directing the requests over to the services.
-   [![Run in Postman](https://run.pstmn.io/button.svg)](https://app.getpostman.com/run-collection/15798447-846dfb27-1616-4c47-98ed-900384c93e64?action=collection%2Ffork&collection-url=entityId%3D15798447-846dfb27-1616-4c47-98ed-900384c93e64%26entityType%3Dcollection%26workspaceId%3D3700ddd4-1040-4ed4-aa63-2a0d2425cf01)
-   **ENV files:** [https://drive.google.com/drive/folders/1BH_2ZdRQfTeSWWMI-kf7HIR3_seh5pCQ?usp=sharing](https://drive.google.com/drive/folders/1BH_2ZdRQfTeSWWMI-kf7HIR3_seh5pCQ?usp=sharing)

## Setup Instructions

-   S1 Clone the project.
-   S2 Create a file .env in the root folder in the given 2 services.ie ./Payments/.env , ./Customer/.env (Env files are provided in the above link on google drive).
-   S3 Make sure that docker is installed in the system.
-   S3 Make sure that PORT 5000 , 5001 , 5002 , 3000 , 27017 are free in the system .
-   S4 Open terminal in root folder of the project where docker-compose.yml file is present and run following commands.

```bash
docker compose up
```

### To verify that all four services are running properly open the following four links in the browser

-   _http://localhost:5000/customer/status_
-   _http://localhost:5000/payments/status_

Each of them would give a message like : Customer service running properly , Payments service running properly

### To access frontend UI open the following link in the browser.

-   _http://localhost:3000_

```bash

# To close application
docker compose down
```

### Architecture of the whole application

![Untitled Diagram-Page-1 drawio](https://user-images.githubusercontent.com/55759980/206905811-bd556672-ac85-43be-8309-0078978314af.png)

### About Project

-   The Project is microservice based .
-   It is based on 3 service : _Frontend_ , _Customer_ , _Payments_
-   Payments and Customer services have their own databases which remain in sync with the help of a message queue.
-   Rabbit Mq is used as a message queue with direct exchange .
-   Both services Payment and Customer are using MongoDb databases .
-   Each request to Backend is Redirected using the NGINX as the gateway.

### Below is the ER diagram model of the Customer and the Payments Services

![alt text](https://res.cloudinary.com/abhistrike/image/upload/v1670756312/Untitled_Diagram-Page-2.drawio_fj4dxb.svg)

## API Endpoints:

```http
POST /customer/signup
```

| Parameter  | Type     | Description          |
| :--------- | :------- | :------------------- |
| `email`    | `string` | _Required_. email-id |
| `password` | `string` | _Required_. password |
| `phone`    | `string` | _Required_. phone    |
| `name`     | `string` | _Required_. Name     |

### Responses

```json
{
	"success": true,
	"data": {
		"_id": "63962ab2cb6ff70012a59ce9",
		"token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImFiaGk3N0BnbWFpbC5jb20iLCJfaWQiOiI2Mzk2MmFiMmNiNmZmNzAwMTJhNTljZTkiLCJpYXQiOjE2NzA3ODU3MTQsImV4cCI6MTY3MDg3MjExNH0.zSp4ZYbSvR3bUsD6C_QobVpSCl-gWPx8G6eJQIo0unE",
		"name": "Yash",
		"phone": "7698225243",
		"email": "yashgosaliya5@gmail.com"
	}
}
```

```json
{
	"success": false,
	"error": "Error on creating customer MongoError",
	"description": "E11000 duplicate key error collection"
}
```

---

```http
POST /payment/start
```

| Header          | Description                |
| :-------------- | :------------------------- |
| `Authorization` | **Required**. Bearer Token |

| Parameter | Type     | Description                           |
| :-------- | :------- | :------------------------------------ |
| `slot`    | `string` | _Required_. Slot time (Eample: 6-7AM) |

### Responses

```json
{
	"success": true,
	"data": {
		"data": {
			"razorpay_order_id": "order_KqiNyjAQIZqycz",
			"customerId": "63962ab2cb6ff70012a59ce9",
			"completed": false,
			"verified": false,
			"amount": 500,
			"slot": "6-7AM",
			"startDate": "2022-12-01T12:00:00.000Z",
			"endDate": "2022-12-31T11:59:00.000Z",
			"_id": "63962c518bed86be92bd3c12",
			"createdAt": "2022-12-11T19:15:29.576Z",
			"updatedAt": "2022-12-11T19:15:29.576Z"
		}
	}
}
```

---

```http
POST /payment/complete
```

| Header          | Description                |
| :-------------- | :------------------------- |
| `Authorization` | **Required**. Bearer Token |

| Parameter             | Type     | Description                     |
| :-------------------- | :------- | :------------------------------ |
| `razorpay_payment_id` | `string` | _Required_. Razerpay Payment ID |
| `razorpay_signature`  | `string` | _Required_. Razerpay Signature  |
| `razorpay_order_id`   | `string` | _Required_. Razerpay Order ID   |

### Responses

```json
{
	"success": true,
	"data": {
		"data": {
			"_id": "6394852a0ec8e40f4ede1381",
			"razorpay_order_id": "order_KqDcoTx1JF2MEu",
			"customerId": "63942e7248f70d0012c2ea9c",
			"completed": true,
			"verified": false,
			"amount": 500,
			"slot": "6-7AM",
			"startDate": "2022-12-01T12:00:00.000Z",
			"endDate": "2022-12-31T11:59:00.000Z",
			"createdAt": "2022-12-10T13:10:02.194Z",
			"updatedAt": "2022-12-10T13:10:09.473Z",
			"razorpay_payment_id": "pay_29QQoUBi66xm2f",
			"razorpay_signature": "9ef4dffbfd84f1318f6739a3ce19f9d85851857ae648f114332d8401e0949a3d"
		}
	}
}
```


### Screenshots
![Screenshot from 2022-12-12 01-08-47](https://user-images.githubusercontent.com/55759980/206925085-37c2f934-bb60-4dd1-9122-6a99fef1fd0b.png)
![Screenshot from 2022-12-12 01-09-16](https://user-images.githubusercontent.com/55759980/206925090-2c15bd1e-49aa-41b3-8eba-55f2061c6257.png)
![Screenshot from 2022-12-12 01-09-31](https://user-images.githubusercontent.com/55759980/206925100-b646021c-1eba-42e7-b9b8-572e48a78d3c.png)
![Screenshot from 2022-12-12 01-10-29](https://user-images.githubusercontent.com/55759980/206925105-0458305e-78a2-451b-b36c-334b84cc7aae.png)



---

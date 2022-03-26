---
title: Into Spring Framework - The IoC Container
---

## 什么是 IoC 容器？

### IoC

IoC，全称 Inversion of Control，是一种设计思想，翻译成中文就是“控制反转”，也被熟知为依赖注入（Dependency Injection，DI）。

在应用中会有各种各样的对象，其中一些对象需要**依赖**其他对象才能正常工作，例如有一个代表车的类，它依赖了引擎：

```java
public class Car {
    private SuperEngine engine;

    public Car() {
        this.engine = new SuperEngine();
    }
}
```

我们在构造方法中**显式、主动地**实例化了所依赖的对象，也即 `Car` 这个类直接依赖了 `SuperEngine` 这个类。如果在 IoC 场景中，我们可能会写成：

```java
public class Car {
    private Engine engine; // 一般是接口类

    public Car(Engine engine) {
        this.engine = engine;
    }
}
```

这里类 `Car` 依赖了 `Engine` 这个接口类，但并没有明确依赖哪个**具体的实现类**，相反，我们可以在实例化类 `Car` 时将依赖传递进去：

```java
SuperEngine superEngine = new SuperEngine(); // SuperEngine 实现了 Engine 接口
Car car = new Car(superEngine);
```

在上面第一段代码中，类 `Car` 所依赖的对象是由它自己所决定并实例化的，而在第二段代码中，这种**控制**被**反转**了，依赖是被**注入**进去的。

### 容器

简单来说，容器就是用于*存放*对象的一个地方。

有了容器之后，我们就不需要实例化对象，而是从容器中获取，换句话说，容器负责创建我们所需要的对象。对象的依赖关系（即所依赖的其他对象）通过构造方法参数（也即上面第二段代码所示）、（实例化它们的）工厂方法参数或者在对象被实例化或从工厂方法返回后要被设置的属性来定义，当容器创建对象时，就会把这些依赖**注入**其中。

## Spring 中的实现

### Spring IoC 容器和 Bean

包 `org.springframework.beans` 和 `org.springframework.context` 是 Spring IoC 容器的基础。接口类 `BeanFactory` 提供了一种高级配置机制，能够管理任何类型的对象，而 `ApplicationContext` 是其子接口，添加了以下内容：

* 更容易和 Spring 的 AOP 功能集成
* 消息资源处理（用于国际化）
* 事件发布
* 应用层特定的上下文，例如用于 Web 应用的 `WebApplicationContext`

简言之，`BeanFactory` 提供了配置框架和基础功能，而 `ApplicationContext` 增加了更多复杂应用特定的功能。

`ApplicationContext` 是 `BeanFactory` 的完整超集，在本章中专门用于描述 Spring 的 IoC 容器。关于 `BeanFactory` 的使用详见 BeanFactory。

在 Spring 中，构成应用主干并由 Spring IoC 容器管理的对象统称为 Bean。一个 Bean 就是一个被 Spring IoC 容器实例化、组装和管理的对象。Bean 和它们的依赖体现在容器所使用的配置元数据中。
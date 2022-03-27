---
title: Into Spring Framework - The IoC Container
---

## 什么是 IoC 容器？

如前所述，Spring Framework 提供了很多核心功能，在这些功能中，最重要的就是 IoC 容器。从某种程度上来说，可以说 Spring Framework 就是一个 IoC 容器。

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

```diff-java
public class Car {
    private Engine engine; // 一般是接口类
+   private Engine engine;
-   6666

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

### 容器概览

接口 `org.springframework.context.ApplicationContext` 代表着 Spring IoC 容器，并负责实例化、配置和组装 bean。容器会通过读取配置元数据来得知要去实例化、配置和组装什么对象。配置元数据可以通过 XML、Java 注解或 Java 代码来提供，主要用于表示组成应用的对象以及它们之间的依赖关系。

除了 `ApplicationContext` 接口以外，Spring 也附带了几个它的实现类。在单应用中，常见的做法是创建一个 `ClassPathXmlApplicationContext` 或者 `FileSystemXmlApplicationContext`。虽然 XML 一直是定义配置元数据的传统格式，但我们可以通过提供少量 XML 配置来以声明方式支持额外的元数据格式，即使用 Java 注解或者代码。

在大多数应用场景下，并不需要明确的用户代码去实例化一个或多个 IoC 容器。例如，在一个 Web 应用场景下，应用的 web.xml 中简单的 8 行左右的模板 Web 描述 XML 代码通常就足够了（详见 Convenient ApplicationContext Instantiation for Web Applications）。

下图显示了 Spring 如何工作的高级视图。应用的类结合了配置元数据，因此当 `ApplicationContext` 被创建和实例化后，就会有一个完全配置且可运行的系统或应用。

![container-magic](/images/into-spring-framework-the-ioc-container/container-magic.png "container-magic")

#### 配置元数据

如前所述，配置元数据传统上以简单直观的 XML 格式提供，本章大部分内容都使用这种格式来传达 Spring IoC 容器的关键概念和特性。

Spring 配置由至少一个需要由容器管理的 bean 定义。基于 XML 的配置元数据将这些 bean 配置为顶级 `<beans/>` 元素内的 `<bean/>` 元素，而 Java 配置通常通过配置类（标注了 `@Configuration` 的类）中标注了 `@Bean` 注解的方法来配置。


